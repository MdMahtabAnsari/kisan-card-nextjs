import { DB } from "@/lib/db/prisma";

import { InfiniteScrollWithSearch } from "@/lib/schema/common/page";

export class GstService {
    private readonly db: DB;

    constructor(db: DB) {
        this.db = db;
    }

    async getGstInfiniteScroll(data: InfiniteScrollWithSearch) {
        const { cursor, limit, search } = data;
        const limitPlusOne = limit ? limit + 1 : 11;
        const gst = await this.db.stateGst.findMany({
            where: {
                ...(search && {
                    OR: [
                        {
                    state: {
                        contains: search,
                        mode: "insensitive"
                    }},
                    {
                    gstNumber: {
                        contains: search,
                        mode: "insensitive"
                    }},
                    {
                    id:{
                        contains: search,
                        mode: "insensitive"
                    }}
                    ]
                })
            },
            ...(cursor && { cursor: { id: cursor } }),
            take: limitPlusOne,
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (gst.length > (limitPlusOne - 1)) {
            const nextItem = gst.pop(); // return the last item from the array
            nextCursor = nextItem!.id;
        }
        return {
            gst,
            nextCursor
        }
    }
}
