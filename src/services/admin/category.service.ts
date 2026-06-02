import { DB } from "@/lib/db/prisma";

import { InfiniteScrollWithSearch } from "@/lib/schema/common/page";

export class CategoryService {
    private readonly db: DB;

    constructor(db: DB) {
        this.db = db;
    }

    async getCategoriesInfiniteScroll(data: InfiniteScrollWithSearch) {
        const { cursor, limit, search } = data;
        const limitPlusOne = limit ? limit + 1 : 11;
        const categories = await this.db.category.findMany({
            where: {
                ...(search && {
                    OR: [
                        {
                    name: {
                        contains: search,
                        mode: "insensitive"
                    }},
                    {
                    id:{
                        contains: search,
                        mode: "insensitive"
                    }
                }
                ]
                })
            },
            ...(cursor && { cursor: { id: cursor } }),
            take: limitPlusOne,
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (categories.length > (limitPlusOne - 1)) {
            const nextItem = categories.pop(); // return the last item from the array
            nextCursor = nextItem!.id;
        }
        return {
            categories,
            nextCursor
        }
    }
}
