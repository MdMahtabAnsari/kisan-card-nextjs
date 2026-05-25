
import { z } from "zod";
import {statusUpdateSchema} from "@/lib/schema/common/status";

export const cardStatusUpdateSchema = z.object({
    cardId: z.uuid(),
}).extend(statusUpdateSchema.shape);

export type CardStatusUpdateSchema = z.infer<typeof cardStatusUpdateSchema>;