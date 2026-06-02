import { DB } from "@/lib/db/prisma";
import {MediaSchema} from "@/lib/schema/common/media";

export class MediaService {
    private readonly db: DB;

    constructor(db: DB) {
        this.db = db;
    }

    async createMedia(data: MediaSchema) {
        return this.db.media.create({
            data,
        });
    }


}

