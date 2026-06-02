import {z} from 'zod';
import {WeekDay} from "@/generated/prisma/browser";

export const workingHourSchema = z.object({
    day:z.enum(WeekDay),
    startTime:z.date(),
    endTime:z.date()
})

export type WorkingHour = z.infer<typeof workingHourSchema>;