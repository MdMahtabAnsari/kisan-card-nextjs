import {z} from 'zod';
import {pageLimitSchema} from "@/lib/schema/common/page";
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

export const createCardSchema = z.object({
    cardNumber:z.string().length(16,"Card Number must have 16 digits").regex(/^\d+$/,"Card Number must contain only digits"),
    cardHolder: z.string().min(1,"Card Holder name is required"),
    type: z.enum(CardType),
    points: z.string().regex(/^\d+(\.\d{1,2})?$/,"Points must be a valid decimal number with up to 2 decimal places").refine((value) => {
        const points = parseFloat(value);
        return points >= 0 && points <= 9999999999.99;
    }),
    shopId: z.uuid(),
    userId:z.string()
})

export type CreateCardForm = z.infer<typeof createCardSchema>;
