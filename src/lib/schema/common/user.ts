
import { z } from "zod";
import {statusUpdateSchema} from "@/lib/schema/common/status";

export const userStatusUpdateSchema = z.object({
    userId: z.string(),
}).extend(statusUpdateSchema.shape);

export type UserStatusUpdateSchema = z.infer<typeof userStatusUpdateSchema>;