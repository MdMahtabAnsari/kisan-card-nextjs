import { DB } from "@/lib/db/prisma";
import { StatusType } from "@/generated/prisma/client";

export class StatusService {
    private readonly db: DB;

    constructor(db: DB) {
        this.db = db;
    }


    async createStatus(name: StatusType) {
        return this.db.status.upsert({
            where: {
                name
            },
            update: {
            },
            create: {
                name
            }
        });
    }
}

