import { DB } from "@/lib/db/prisma";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

export class RevenueService {
    private readonly db: DB;

    constructor(db: DB) {
        this.db = db;
    }

    async getMonthlyRevenue() {
        const now = new Date();

        // 1. Current month boundaries
        const currentMonthStart = startOfMonth(now);
        const currentMonthEnd = endOfMonth(now);

        // 2. Cleaner calculation for last month
        const lastMonth = subMonths(now, 1);
        const lastMonthStart = startOfMonth(lastMonth);
        const lastMonthEnd = endOfMonth(lastMonth);

        const [currentMonthRevenue, lastMonthRevenue, totalRevenue] = await Promise.all([
            this.db.transaction.aggregate({
                _sum: {
                    totalAmount: true,
                },
                where: {
                    createdAt: {
                        gte: currentMonthStart,
                        lte: currentMonthEnd,
                    },
                    payments: {
                        some: {
                            status: "COMPLETED"
                        }
                    }

                },
            }),
            this.db.transaction.aggregate({
                _sum: {
                    totalAmount: true,
                },
                where: {
                    createdAt: {
                        gte: lastMonthStart,
                        lte: lastMonthEnd,
                    },
                    payments: {
                        some: {
                            status: "COMPLETED"
                        }
                    }

                },
            }),
            this.db.transaction.aggregate({
                _sum: {
                    totalAmount: true,
                },
                where: {
                    payments: {
                        some: {
                            status: "COMPLETED"
                        }
                    }
                }
            }),

        ]);

        const parsedCurrentMonthRevenue = Number(currentMonthRevenue._sum.totalAmount) || 0;
        const parsedLastMonthRevenue = Number(lastMonthRevenue._sum.totalAmount) || 0;
        const parsedTotalRevenue = Number(totalRevenue._sum.totalAmount) || 0;

        const percentageChange = parsedLastMonthRevenue > 0
            ? ((parsedCurrentMonthRevenue - parsedLastMonthRevenue) / parsedLastMonthRevenue) * 100
            : (parsedCurrentMonthRevenue > 0 ? 100 : 0);

        return {
            currentMonthRevenue: parsedCurrentMonthRevenue,
            lastMonthRevenue: parsedLastMonthRevenue,
            totalRevenue: parsedTotalRevenue,
            percentageChange
        };
    }
}