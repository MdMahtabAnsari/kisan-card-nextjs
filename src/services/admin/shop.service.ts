import { DB } from "@/lib/db/prisma";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

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
}