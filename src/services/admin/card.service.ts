import { DB } from "@/lib/db/prisma";
import { startOfMonth, endOfMonth, subMonths, startOfDay, endOfDay, subDays, format, isBefore, addDays } from "date-fns";
import { StatusType, CardType, Prisma } from "@/generated/prisma/client";
import { DayEnum } from "@/lib/schema/day";
import { FilterCardSchema } from "@/lib/schema/admin/card";
import { PaginationSchema } from "@/lib/schema/page";


export class CardService {
    private readonly db: DB;

    constructor(db: DB) {
        this.db = db;
    }

    async getMonthlyCards(type?: StatusType) {
        const now = new Date();

        // 1. Current month boundaries
        const currentMonthStart = startOfMonth(now);
        const currentMonthEnd = endOfMonth(now);

        // 2. Cleaner calculation for last month
        const lastMonth = subMonths(now, 1);
        const lastMonthStart = startOfMonth(lastMonth);
        const lastMonthEnd = endOfMonth(lastMonth);

        const [currentMonthCount, lastMonthCount, totalCount] = await Promise.all([
            this.db.card.count({
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
            this.db.card.count({
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
            this.db.card.count({
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

    async getCardTypeOverTime(days: DayEnum) {
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

        const [standardCards, premiumCards, vipCards] = await Promise.all([
            this.db.card.groupBy({
                by: ["createdAt"],
                where: {
                    ...dayFilter,
                    deletedAt: null,
                    type: CardType.STANDARD
                },
                _count: { id: true },
                orderBy: { createdAt: "asc" }
            }),
            this.db.card.groupBy({
                by: ["createdAt"],
                where: {
                    ...dayFilter,
                    deletedAt: null,
                    type: CardType.PREMIUM
                }
                ,
                _count: { id: true },
                orderBy: { createdAt: "asc" }
            }),
            this.db.card.groupBy({
                by: ["createdAt"],
                where: {
                    ...dayFilter,
                    deletedAt: null,
                    type: CardType.VIP
                }
                ,
                _count: { id: true },
                orderBy: { createdAt: "asc" }
            }),
        ]);

        const standardCardMap = new Map<string, number>();
        standardCards.forEach(item => {
            const dateKey = format(item.createdAt, 'yyyy-MM-dd');
            standardCardMap.set(dateKey, standardCardMap.get(dateKey) ? standardCardMap.get(dateKey)! + item._count.id : item._count.id);
        });
        const premiumCardMap = new Map<string, number>();
        premiumCards.forEach(item => {
            const dateKey = format(item.createdAt, 'yyyy-MM-dd');
            premiumCardMap.set(dateKey, premiumCardMap.get(dateKey) ? premiumCardMap.get(dateKey)! + item._count.id : item._count.id);
        });
        const vipCardMap = new Map<string, number>();
        vipCards.forEach(item => {
            const dateKey = format(item.createdAt, 'yyyy-MM-dd');
            vipCardMap.set(dateKey, vipCardMap.get(dateKey) ? vipCardMap.get(dateKey)! + item._count.id : item._count.id);
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
                ...Array.from(standardCardMap.keys()),
                ...Array.from(premiumCardMap.keys()),
                ...Array.from(vipCardMap.keys())
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
            standard: standardCardMap.get(date) ?? 0,
            premium: premiumCardMap.get(date) ?? 0,
            vip: vipCardMap.get(date) ?? 0,
        }));
        return result;
    }

    async getCards(filter: FilterCardSchema) {
        const { pageLimit, type, status, search, createdAt, cardNumber, cardHolder, typeSort, points } = filter;
        const { page, limit } = pageLimit;
        const cardCount = await this.db.card.count({
            where: {
                deletedAt: null,
                ...(search && {
                    OR: [
                        { cardNumber: { contains: search, mode: "insensitive" } },
                        { cardHolder: { contains: search, mode: "insensitive" } },
                        { id: { contains: search, mode: "insensitive" } },

                    ]
                }),
                ...(type && { type: { in: type } }),
                ...(status && {
                    statuses: {
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
            totalPages: Math.ceil(cardCount / limit),
            totalItems: cardCount,
            limit: limit,
        };

        if (cardCount === 0) {
            return {
                cards: [],
                pagination
            };
        }

        const skip = (page - 1) * limit;

        const orderBy: Prisma.CardOrderByWithRelationInput | undefined = (createdAt || cardNumber || cardHolder || typeSort || points) ? {
            ...(createdAt && { createdAt }),
            ...(cardNumber && { cardNumber }),
            ...(cardHolder && { cardHolder }),
            ...(typeSort && { type: typeSort }),
            ...(points && { points })
        } : undefined;

        console.log("Order By:", orderBy);

        const cards = await this.db.card.findMany({
            where: {
                deletedAt: null,
                ...(search && {
                    OR: [
                        { cardNumber: { contains: search, mode: "insensitive" } },
                        { cardHolder: { contains: search, mode: "insensitive" } },
                        { id: { contains: search, mode: "insensitive" } },
                    ]
                }),
                ...(type && { type: { in: type } }),
                ...(status && {
                    statuses: {
                        some: {
                            isCurrent: true,
                            status: {
                                name: { in: status }
                            }
                        }
                    }
                }),
            },
            orderBy,
            skip,
            take: limit,
            include: {
                statuses: {
                    where: {
                        isCurrent: true,
                        ...(status && {
                            status: {
                                name: { in: status }
                            }
                        })
                    },
                    include: {
                        status: true
                    }
                },
                user: true,
                shop: true,

            }
        });


        return {
            cards,
            pagination
        };
    }

    async updateCardStatus({ cardId, status, userId, notes }: { cardId: string, status: StatusType, userId: string, notes?: string }) {
        const createdStatus = await this.db.status.upsert({
            where: {
                name: status
            },
            create: {
                name: status,
            },
            update: {}
        });
        await this.db.cardStatus.updateMany({
            where: {
                cardId,
                isCurrent: true
            },
            data: {
                isCurrent: false
            }
        });
        return await this.db.cardStatus.upsert({
            where: {
                cardId_statusId: {
                    cardId,
                    statusId: createdStatus.id
                }
            },
            create: {
                cardId,
                statusId: createdStatus.id,
                createdById: userId,
                notes: notes
            },
            update: {
                isCurrent: true,
                notes: notes,
                createdById: userId

            }
        })
    }
}
