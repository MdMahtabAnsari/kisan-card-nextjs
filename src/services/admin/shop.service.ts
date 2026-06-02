import {DB} from "@/lib/db/prisma";
import {addDays, endOfDay, endOfMonth, format, isBefore, startOfDay, startOfMonth, subDays, subMonths} from "date-fns";
import {CreateShopBackEndForm, FilterShopInfiniteScrollSchema, FilterShopSchema} from "@/lib/schema/admin/shop";
import {AddressService} from "@/services/common/address.service";
import {MediaService} from "@/services/common/media.service";
import {MediaSchema} from "@/lib/schema/common/media";
import {CreateShopStatus} from "@/lib/types/shop";
import {StatusService} from "@/services/common/status.service";
import {StatusType} from "@/generated/prisma/client";
import {DayEnum} from "@/lib/schema/common/day";
import {PaginationSchema} from "@/lib/schema/common/page";

export class ShopService {
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
            this.db.shop.count({
                where: {
                    createdAt: {
                        gte: currentMonthStart,
                        lte: currentMonthEnd,
                    },
                    deletedAt: null,

                },
            }),
            this.db.shop.count({
                where: {
                    createdAt: {
                        gte: lastMonthStart,
                        lte: lastMonthEnd,
                    },
                    deletedAt: null,

                },
            }),
            this.db.shop.count({
                where: {
                    deletedAt: null,
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

    async createShop(userId: string, data: CreateShopBackEndForm) {
        const addressService = new AddressService(this.db);
        const address = await addressService.createAddress(data.address);
        const shop = await this.db.shop.create({
            data: {
                name: data.name,
                code: data.code,
                description: data.description,
                email: data.email,
                phone: data.phone,
                categoryId: data.categoryId,
                stateGstId: data.stateGstId,
                addressId: address.id,
            }
        });
        await this.createShopManager(shop.id, data.shopManagerId);
        await this.createShopMedia(shop.id, data.media);
        await this.createShopStatus({
            shopId: shop.id,
            status: "PENDING",
            notes: "Shop created and pending approval",
            createdById: userId
        });
        return shop;
    }

    async createShopManager(shopId: string, managerId: string) {
        const haveAlreadyShopManager = await this.db.shopManager.findFirst({
            where: {
                userId: managerId,
                status: "ACTIVE"
            }
        });
        if (haveAlreadyShopManager) {
            throw new Error("This user is already a shop manager for another shop");
        }
        return this.db.shopManager.upsert({
            where: {
                userId_shopId: {
                    userId: managerId,
                    shopId: shopId,
                },
            },
            update: {
                status: "ACTIVE"
            },
            create: {
                shopId: shopId,
                userId: managerId,
                status: "ACTIVE"
            }
        });

    }

    async createShopMedia(shopId: string, mediaUrls: MediaSchema[]) {
        const mediaService = new MediaService(this.db);
        const mediaRecords = await Promise.all(mediaUrls.map(async (media) => {
            return await mediaService.createMedia({
                url: media.url,
                type: media.type,
            });
        }));
        return await Promise.all(mediaRecords.map(async (media) => {
            return this.db.shopMedia.create({
                data: {
                    shopId: shopId,
                    mediaId: media.id,
                }
            });
        }));
    }

    async createShopStatus(data: CreateShopStatus) {
        const statusService = new StatusService(this.db);
        const status = await statusService.createStatus(data.status)
        return this.db.shopStatus.create({
            data: {
                shopId: data.shopId,
                statusId: status.id,
                notes: data.notes,
                createdById: data.createdById,
            }
        });
    }

    async getShopsInfiniteScroll(data:FilterShopInfiniteScrollSchema) {
        const {cursor,limit,name,code,email,phone,status,search,createdAt} = data

        const limitPlusOne = limit ? limit + 1 : 11;
        const orderBy = (name||code||email||phone) && {
            ...(name && { name: name }),
            ...(email && { email: email }),
            ...(code && {  code: code }),
            ...(phone && { phone: phone }),
            ...(createdAt && { createdAt: createdAt }),
        }
        const shops = await this.db.shop.findMany({
            where:{
                ...(search && {
                    OR: [
                        { id: { contains: search, mode: "insensitive" } },
                        { name: { contains: search, mode: "insensitive" } },
                        { email: { contains: search, mode: "insensitive" } },
                        { phone: { contains: search, mode: "insensitive" } },
                        { code: { contains: search, mode: "insensitive" } }
                    ]
                }),
                ...(status !== undefined && {
                    statuses: {
                        some: {
                            isCurrent: true,
                            status: {
                                name: { in: status }
                            }
                        }
                    }
                })
            },
            ...(cursor && { cursor: { id: cursor } }),
            take: limitPlusOne,
            orderBy,


        })

        let nextCursor: typeof cursor | undefined = undefined;
        if (shops.length > (limitPlusOne - 1)) {
            const nextItem = shops.pop(); // return the last item from the array
            nextCursor = nextItem!.id;
        }
        return {
            shops,
            nextCursor
        }
    }
    async getMonthlyShops(type?: StatusType) {
        const now = new Date();

        // 1. Current month boundaries
        const currentMonthStart = startOfMonth(now);
        const currentMonthEnd = endOfMonth(now);

        // 2. Cleaner calculation for last month
        const lastMonth = subMonths(now, 1);
        const lastMonthStart = startOfMonth(lastMonth);
        const lastMonthEnd = endOfMonth(lastMonth);

        const [currentMonthCount, lastMonthCount, totalCount] = await Promise.all([
            this.db.shop.count({
                where: {
                    createdAt: {
                        gte: currentMonthStart,
                        lte: currentMonthEnd,
                    },
                    deletedAt: null,
                    ...(type && {
                        statuses: {
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
            this.db.shop.count({
                where: {
                    createdAt: {
                        gte: lastMonthStart,
                        lte: lastMonthEnd,
                    },
                    deletedAt: null,
                    ...(type && {
                        statuses: {
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
            this.db.shop.count({
                where: {
                    deletedAt: null,
                    ...(type && {
                        statuses: {
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


        const shops = await this.db.shop.groupBy({
            by:["createdAt"],
            where:{
                ...dayFilter
            },
            _count:{id:true},
            orderBy:{createdAt:"asc"}
        })



        const shopsMap = new Map<string, number>();
        shops.forEach(item => {
            const dateKey = format(item.createdAt, 'yyyy-MM-dd');
            shopsMap.set(dateKey, shopsMap.get(dateKey) ? shopsMap.get(dateKey)! + item._count.id : item._count.id);
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
                ...Array.from(shopsMap.keys()),
            ]);
            const startDay = Array.from(set).sort()[0];
            let cursor = startOfDay(startDay);
            const last = startOfDay(endDay);
            while (isBefore(cursor, addDays(last, 1))) {
                dates.push(format(cursor, 'yyyy-MM-dd'));
                cursor = addDays(cursor, 1);
            }
        }
        return dates.map(date => ({
            date,
            shops: shopsMap.get(date) ?? 0

        }));
    }

    async getShops(data:FilterShopSchema) {
        const {pageLimit,name,code,email,phone,status,search,createdAt} = data
        const {page,limit} = pageLimit;


        const shopCount = await this.db.shop.count({
            where:{
                deletedAt: null,
                ...(search && {
                    OR: [
                        { id: { contains: search, mode: "insensitive" } },
                        { name: { contains: search, mode: "insensitive" } },
                        { email: { contains: search, mode: "insensitive" } },
                        { phone: { contains: search, mode: "insensitive" } },
                        { code: { contains: search, mode: "insensitive" } }
                    ]
                }),
                ...(status !== undefined && {
                    statuses: {
                        some: {
                            isCurrent: true,
                            status: {
                                name: { in: status }
                            }
                        }
                    }
                })
            },

        })

        const pagination: PaginationSchema = {
            currentPage: page,
            totalPages: Math.ceil(shopCount / limit),
            totalItems: shopCount,
            limit: limit,
        };

        if (shopCount === 0) {
            return { shops: [], pagination };
        }
        const skip = (page - 1) * limit;
        const orderBy = (name||code||email||phone) && {
            ...(name && { name: name }),
            ...(email && { email: email }),
            ...(code && {  code: code }),
            ...(phone && { phone: phone }),
            ...(createdAt && { createdAt: createdAt }),
        }
        const shops = await this.db.shop.findMany({
            where:{
                deletedAt: null,
                ...(search && {
                    OR: [
                        { id: { contains: search, mode: "insensitive" } },
                        { name: { contains: search, mode: "insensitive" } },
                        { email: { contains: search, mode: "insensitive" } },
                        { phone: { contains: search, mode: "insensitive" } },
                        { code: { contains: search, mode: "insensitive" } }
                    ]
                }),
                ...(status !== undefined && {
                    statuses: {
                        some: {
                            isCurrent: true,
                            status: {
                                name: { in: status }
                            }
                        }
                    }
                })
            },
            include:{
                managers:{
                    where:{
                        status:"ACTIVE"
                    },
                    include:{
                        user:true
                    }

                },
                statuses:{
                    where:{
                        isCurrent:true
                    },
                    include:{
                        status:true
                    }

                },
                address:true,
                category:true,
                stateGst:true
            },

            take: limit,
            orderBy,
            skip


        })


        return {
            shops,
            pagination
        }
    }

}

