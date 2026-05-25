import {z} from "zod"
import { StatusType } from "@/generated/prisma/browser";



export const statusUpdateSchema = z.object({
    status: z.enum(StatusType),
    notes: z.string().max(500).optional(),
})

export type StatusUpdateSchema = z.infer<typeof statusUpdateSchema>;