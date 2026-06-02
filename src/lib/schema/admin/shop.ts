import {z} from 'zod';
import {addressSchema} from "@/lib/schema/common/address";
import {mediaSchema} from "@/lib/schema/common/media";
import {Content} from "@tiptap/react";
import { pageLimitSchema } from "@/lib/schema/common/page";
import { SortOrder } from "@/lib/types/sort";
import { infiniteScroll } from "@/lib/schema/common/page";
import {StatusType} from "@/generated/prisma/enums";



export const createShopFrontEndSchema = z.object({
    name: z.string().min(2, "Shop name must be at least 2 characters long").max(100, "Shop name must be less than 100 characters long"),
    code: z.string().min(2, "Shop code must be at least 2 characters long").max(50, "Shop code must be less than 50 characters long").regex(/^[a-zA-Z0-9_-]*$/, "Shop code can only contain letters, numbers, underscores and hyphens"),
    description: z.custom<Content>(),
    address: addressSchema,
    media: z.array(mediaSchema).min(1, "At least one image is required").max(5, "No more than 5 images are allowed"),
    categoryId: z.uuid(),
    stateGstId:z.uuid(),
    shopManagerId: z.string(),
    email: z.email(),
    phone:z.string().length(10, "Phone number must be 10 digits long").regex(/^[0-9]+$/, "Phone number can only contain digits"),
});

export type CreateShopFrontEndForm = z.infer<typeof createShopFrontEndSchema>;

export const createShopBackEndSchema = createShopFrontEndSchema.omit({description: true}).extend({
    description: z.string().optional(),
});

export type CreateShopBackEndForm = z.infer<typeof createShopBackEndSchema>;


export const filterShopSchema = z.object({
 pageLimit:pageLimitSchema,
    name:z.enum(SortOrder).optional(),
    code:z.enum(SortOrder).optional(),
    email:z.enum(SortOrder).optional(),
    phone:z.enum(SortOrder).optional(),
    status: z.array(z.enum(StatusType)).optional(),
    search: z.string().optional(),
    createdAt:z.enum(SortOrder).optional(),
})

export type FilterShopSchema = z.infer<typeof filterShopSchema>;

export const filterShopInfiniteScrollSchema = filterShopSchema.omit({pageLimit:true}).extend(infiniteScroll.shape);

export type FilterShopInfiniteScrollSchema = z.infer<typeof filterShopInfiniteScrollSchema>;
