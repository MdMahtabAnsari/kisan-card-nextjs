import { DB } from "@/lib/db/prisma";
import { startOfMonth, endOfMonth, subMonths, startOfDay, endOfDay, subDays, format, isBefore, addDays } from "date-fns";
import { DayEnum } from "@/lib/schema/day";
import { FilterUserSchema } from "@/lib/schema/admin/user";
import { PaginationSchema } from "@/lib/schema/page";
import { Prisma } from "@/generated/prisma/client";

export class UserService {
    private readonly db: DB;

    constructor(db: DB) {
        this.db = db;
    }

    async getMonthlyRegistrations() {
        const now = new Date();

        // 1. Current month boundaries
        const currentMonthStart = startOfMonth(now);
        const currentMonthEnd = endOfMonth(now);

        // 2. Cleaner calculation for last month
        const lastMonth = subMonths(now, 1);
        const lastMonthStart = startOfMonth(lastMonth);
        const lastMonthEnd = endOfMonth(lastMonth);

        const [currentMonthCount, lastMonthCount, totalCount] = await Promise.all([
            this.db.user.count({
                where: {
                    createdAt: {
                        gte: currentMonthStart,
                        lte: currentMonthEnd,
                    },
                },
            }),
            this.db.user.count({
                where: {
                    createdAt: {
                        gte: lastMonthStart,
                        lte: lastMonthEnd,
                    },
                },
            }),
            this.db.user.count()
        ]);

        const percentageChange = lastMonthCount > 0
            ? ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100
            : (currentMonthCount > 0 ? 100 : 0);

        return {
            currentMonthCount,
            lastMonthCount,
            totalCount,
            percentageChange
        };
    }

    async getRegistrationsOverTime(days: DayEnum) {
        const now = new Date();
        const startDay = days === "1"
            ? startOfDay(now)
            : days !== "ALL"
                ? startOfDay(subDays(now, Number(days) - 1))
                : undefined;
        const endDay = endOfDay(now);
        const dayFilter = days !== "ALL"
            ? {
                createdAt: {
                    gte: startDay,
                    lte: endDay
                }
            }
            : undefined;

        const [users, admins, shopManagers, warehouseManagers] = await Promise.all([
            this.db.user.groupBy({
                by: ["createdAt"],
                where: {
                    role: "USER",
                    ...dayFilter
                },
                _count: { id: true },
                orderBy: { createdAt: "asc" }
            }),
            this.db.user.groupBy({
                by: ["createdAt"],
                where: {
                    role: "ADMIN",
                    ...dayFilter
                },
                _count: { id: true },
                orderBy: { createdAt: "asc" }
            }),
            this.db.user.groupBy({
                by: ["createdAt"],
                where: {
                    role: "SHOP_MANAGER",
                    ...dayFilter
                },
                _count: { id: true },
                orderBy: { createdAt: "asc" }
            }),
            this.db.user.groupBy({
                by: ["createdAt"],
                where: {
                    role: "WAREHOUSE_MANAGER",
                    ...dayFilter
                },
                _count: { id: true },
                orderBy: { createdAt: "asc" }
            }),

        ]);

        const usersMap = new Map<string, number>();
        users.forEach(item => {
            const dateKey = format(item.createdAt, 'yyyy-MM-dd');
            usersMap.set(dateKey, usersMap.get(dateKey) ? usersMap.get(dateKey)! + item._count.id : item._count.id);
        });
        const shopManagersMap = new Map<string, number>();
        shopManagers.forEach(item => {
            const dateKey = format(item.createdAt, 'yyyy-MM-dd');
            shopManagersMap.set(dateKey, shopManagersMap.get(dateKey) ? shopManagersMap.get(dateKey)! + item._count.id : item._count.id);
        });
        const warehouseManagersMap = new Map<string, number>();
        warehouseManagers.forEach(item => {
            const dateKey = format(item.createdAt, 'yyyy-MM-dd');
            warehouseManagersMap.set(dateKey, warehouseManagersMap.get(dateKey) ? warehouseManagersMap.get(dateKey)! + item._count.id : item._count.id);
        });
        const adminsMap = new Map<string, number>();
        admins.forEach(item => {
            const dateKey = format(item.createdAt, 'yyyy-MM-dd');
            adminsMap.set(dateKey, adminsMap.get(dateKey) ? adminsMap.get(dateKey)! + item._count.id : item._count.id);
        });
        const dates: string[] = [];
        if (startDay) {
            let cursor = startOfDay(startDay);
            const last = startOfDay(endDay);
            while (isBefore(cursor, addDays(last, 1))) {
                dates.push(format(cursor, 'yyyy-MM-dd'));
                cursor = addDays(cursor, 1);
            }
        } else {
            const set = new Set<string>([
                ...Array.from(usersMap.keys()),
                ...Array.from(shopManagersMap.keys()),
                ...Array.from(warehouseManagersMap.keys()),
                ...Array.from(adminsMap.keys())
            ]);
            const startDay = Array.from(set).sort()[0];
            let cursor = startOfDay(startDay);
            const last = startOfDay(endDay);
            while (isBefore(cursor, addDays(last, 1))) {
                dates.push(format(cursor, 'yyyy-MM-dd'));
                cursor = addDays(cursor, 1);
            }
        }
        const result = dates.map(date => ({
            date,
            users: usersMap.get(date) ?? 0,
            shopManagers: shopManagersMap.get(date) ?? 0,
            warehouseManagers: warehouseManagersMap.get(date) ?? 0,
            admins: adminsMap.get(date) ?? 0,
        }));
        return result;
    }

    async getUsers(filter: FilterUserSchema) {
        const { pageLimit, name, email, role, createdAt, search, roles, emailVerified, phoneNumberVerified, banned } = filter;
        const { page, limit } = pageLimit;

        const userCount = await this.db.user.count({
            where: {
                ...(search && {
                    OR: [
                        { id: { contains: search, mode: "insensitive" } },
                        { name: { contains: search, mode: "insensitive" } },
                        { email: { contains: search, mode: "insensitive" } },
                        { phoneNumber: { contains: search, mode: "insensitive" } },
                        { aadhaarNumber: { contains: search, mode: "insensitive" } },
                        { username: { contains: search, mode: "insensitive" } },
                        { displayUsername: { contains: search, mode: "insensitive" } },
                    ]
                }),
                ...(roles && {
                    role: {
                        in: roles
                    }
                }),
                ...(emailVerified !== undefined && {
                    emailVerified
                }),
                ...(phoneNumberVerified !== undefined && {
                    OR: phoneNumberVerified
                        ? [{ phoneNumberVerified: true }]
                        : [
                            { phoneNumberVerified: false },
                            { phoneNumberVerified: null },
                        ],
                }),
                ...(banned !== undefined && {
                    banned
                })


            }
        });
        const pagination: PaginationSchema = {
            currentPage: page,
            totalPages: Math.ceil(userCount / limit),
            totalItems: userCount,
            limit: limit,
        };

        if (userCount === 0) {
            return { users: [], pagination };
        }

        const skip = (page - 1) * limit;
        const orderBy: Prisma.UserOrderByWithRelationInput | undefined = (name || email || role || createdAt) && {
            ...(name && { name: name }),
            ...(email && { email: email }),
            ...(role && { role: role }),
            ...(createdAt && { createdAt: createdAt }),
        }

        const users = await this.db.user.findMany({
            where: {
                ...(search && {
                    OR: [
                        { id: { contains: search, mode: "insensitive" } },
                        { name: { contains: search, mode: "insensitive" } },
                        { email: { contains: search, mode: "insensitive" } },
                        { phoneNumber: { contains: search, mode: "insensitive" } },
                        { aadhaarNumber: { contains: search, mode: "insensitive" } },
                        { username: { contains: search, mode: "insensitive" } },
                        { displayUsername: { contains: search, mode: "insensitive" } },
                    ]
                }),
                ...(roles && {
                    role: {
                        in: roles
                    }
                }),
                ...(emailVerified !== undefined && {
                    emailVerified
                }),
                ...(phoneNumberVerified !== undefined && {
                    OR: phoneNumberVerified
                        ? [{ phoneNumberVerified: true }]
                        : [
                            { phoneNumberVerified: false },
                            { phoneNumberVerified: null },
                        ],
                }),
                ...(banned !== undefined && {
                    banned
                })
            },
            skip,
            take: limit,
            orderBy,
        });
        return { users, pagination };


    }
}

