import {z} from 'zod';
import {pageLimitSchema} from "@/lib/schema/page";
import {CardType} from "@/generated/prisma/browser";
import {StatusType} from "@/generated/prisma/browser";
import { SortOrder } from "@/lib/types/sort";


export const filterCardSchema = z.object({
    pageLimit: pageLimitSchema,
    type: z.array(z.enum(CardType)).optional(),
    status: z.array(z.enum(StatusType)).optional(),
    search: z.string().optional(),
    createdAt: z.enum(SortOrder).optional(),
    cardNumber: z.enum(SortOrder).optional(),
    cardHolder: z.enum(SortOrder).optional(),
    typeSort: z.enum(SortOrder).optional(),
    points: z.enum(SortOrder).optional(),

});

export type FilterCardSchema = z.infer<typeof filterCardSchema>;
