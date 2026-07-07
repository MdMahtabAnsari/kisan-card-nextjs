import { DB } from "@/lib/db/prisma";
import { startOfMonth, endOfMonth, subMonths, startOfDay, endOfDay, subDays, format, isBefore, addDays } from "date-fns";
import { DayEnum } from "@/lib/schema/common/day";
import { FilterUserSchema, FilterUserInfiniteScrollSchema } from "@/lib/schema/admin/user";
import { PaginationSchema } from "@/lib/schema/common/page";
import { Prisma } from "@/generated/prisma/client";
import { StatusType } from "@/generated/prisma/client";
import { StatusService } from "@/services/common/status.service";
import { InfiniteScrollWithSearch } from "@/lib/schema/common/page";
import { CreateUserStatus } from "@/lib/types/user";

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
        const { pageLimit, name, email, role, createdAt, search, roles, emailVerified, phoneNumberVerified, banned, status } = filter;
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
                }),
                ...(status !== undefined && {
                    userStatuses: {
                        some: {
                            isCurrent: true,
                            status: {
                                name: { in: status }
                            }
                        }
                    }
                }),


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
                }),
                ...(status !== undefined && {
                    userStatuses: {
                        some: {
                            isCurrent: true,
                            status: {
                                name: { in: status }
                            }
                        }
                    }
                })
            },
            include: {
                userStatuses: {
                    where: {
                        isCurrent: true
                    },
                    include: {
                        status: true
                    }
                }
            },
            skip,
            take: limit,
            orderBy,
        });
        return { users, pagination };


    }

    async createUserStatus(data: CreateUserStatus) {
        const statusService = new StatusService(this.db);
        const createdStatus = await statusService.createStatus(data.status);
        return this.db.userStatus.create({
            data: {
                userId: data.userId,
                statusId: createdStatus.id,
                createdById: data.createdById,
                notes: data.notes
            }
        });
    }

    async getUsersInfiniteScroll(filter: FilterUserInfiniteScrollSchema) {
        const { cursor, limit, name, email, role, createdAt, search, roles, emailVerified, phoneNumberVerified, banned, status } = filter;

        const limitPlusOne = limit ? limit + 1 : 11;

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
                }),
                ...(status !== undefined && {
                    userStatuses: {
                        some: {
                            isCurrent: true,
                            status: {
                                name: { in: status }
                            }
                        }
                    }
                })
            },
            include: {
                userStatuses: {
                    where: {
                        isCurrent: true
                    },
                    include: {
                        status: true
                    }
                }
            },
            ...(cursor && { cursor: { id: cursor } }),
            take: limitPlusOne,
            orderBy,
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (users.length > (limitPlusOne - 1)) {
            const nextItem = users.pop(); // return the last item from the array
            nextCursor = nextItem!.id;
        }
        return {
            users,
            nextCursor
        }


    }

    async getNonAssignedShopManagersInfiniteScroll(filter: InfiniteScrollWithSearch) {
        const { cursor, limit, search } = filter;

        const limitPlusOne = limit ? limit + 1 : 11;

        const users = await this.db.user.findMany({
            where: {
                role: "SHOP_MANAGER",
                shops: {
                    none: {
                        status: "ACTIVE"
                    }
                    
                },
                userStatuses: {
                    some: {
                        isCurrent: true,
                        status: {
                            name: StatusType.ACTIVE
                        }
                    }
                },
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
                })
            },
            ...(cursor && { cursor: { id: cursor } }),
            take: limitPlusOne,
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (users.length > (limitPlusOne - 1)) {
            const nextItem = users.pop(); // return the last item from the array
            nextCursor = nextItem!.id;
        }
        return {
            users,
            nextCursor
        }
    }

    async updateUserStatus(data: CreateUserStatus) {
        const statusService = new StatusService(this.db);
        const createdStatus = await statusService.createStatus(data.status);
        await this.db.userStatus.updateMany({
            where: {
                userId: data.userId,
                isCurrent: true
            },
            data: {
                isCurrent: false
            }
        })
        return this.db.userStatus.upsert({
            where: {
                userId_statusId: {
                    userId: data.userId,
                    statusId: createdStatus.id
                }
            },
            create: {
                userId: data.userId,
                statusId: createdStatus.id,
                notes: data.notes,
                createdById: data.createdById
            },
            update: {
                isCurrent:true,
                notes: data.notes,
                createdById: data.createdById
            }
        });
    }
    async getUsersWithoutActiveCardInfiniteScroll(filter: InfiniteScrollWithSearch) {
        const { cursor, limit, search } = filter;
        const limitPlusOne = limit ? limit + 1 : 11;
        const users = await this.db.user.findMany({
            where: {
                role:"USER",
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
                cards: {
                    none: {
                        statuses: {
                            some: {
                                isCurrent: true,
                                status: {
                                    name: "ACTIVE",
                                },
                            },
                        },
                    },
                },
            },
            ...(cursor && { cursor: { id: cursor } }),
            take: limitPlusOne,
        });
        let nextCursor: typeof cursor | undefined = undefined;
        if (users.length > (limitPlusOne - 1)) {
            const nextItem = users.pop(); // return the last item from the array
            nextCursor = nextItem!.id;
        }
        return {
            users,
            nextCursor
        }

    }

    async getMonthlyUsers(type?:StatusType){
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
                    ...(type && {
                        userStatuses: {
                            some: {
                                isCurrent: true,
                                status: {
                                    name: type
                                }
                            }
                        }
                    })

                },
            }),
            this.db.user.count({
                where: {
                    createdAt: {
                        gte: lastMonthStart,
                        lte: lastMonthEnd,
                    },
                    ...(type && {
                        userStatuses: {
                            some: {
                                isCurrent: true,
                                status: {
                                    name: type
                                }
                            }
                        }
                    })


                },
            }),
            this.db.user.count({
                where: {
                    ...(type && {
                        userStatuses: {
                            some: {
                                isCurrent: true,
                                status: {
                                    name: type
                                }
                            }
                        }
                    })

                }
            }),

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
}
