import { DB } from "@/lib/db/prisma";
import { DocumentType } from "@/generated/prisma/client";


export class DocumentService {
    private readonly db: DB;

    constructor(db: DB) {
        this.db = db;
    }

    async createDocument({ type, mediaId, createdById, userId }: { type: DocumentType, mediaId: string, createdById: string, userId: string }) {
        return this.db.userDocument.create({
            data: {
                type,
                mediaId,
                createdById,
                userId
            }
        });
    }

    


}

