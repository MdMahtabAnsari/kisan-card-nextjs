import {z} from "zod";
import {cardTypeEnum} from "@/lib/schema/common/card";

export const cardTypeWithIsActiveSchema = z.object({
    type: cardTypeEnum,
    isActive: z.boolean()
});

export type CardTypeWithIsActiveSchema = z.infer<typeof cardTypeWithIsActiveSchema>;