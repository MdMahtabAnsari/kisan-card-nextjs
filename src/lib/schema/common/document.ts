import {z} from "zod";
import {mediaSchema} from "@/lib/schema/common/media";
import {DocumentType} from "@/generated/prisma/browser";


export const documentSchema = z.object({
    type:z.enum(DocumentType,{message:"Invalid document type"}),
    media:mediaSchema,
});

export type DocumentSchema = z.infer<typeof documentSchema>;

