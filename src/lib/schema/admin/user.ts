import { z } from "zod";
import { pageLimitSchema } from "@/lib/schema/page";
import { SortOrder } from "@/lib/types/sort";
import { UserRole } from "@/generated/prisma/browser";




export const filterUserSchema = z.object({
    pageLimit: pageLimitSchema,
    name: z.enum(SortOrder).optional(),
    email: z.enum(SortOrder).optional(),
    role: z.enum(SortOrder).optional(),
    createdAt: z.enum(SortOrder).optional(),
    search: z.string().optional(),
    roles: z.array(z.enum(UserRole)).optional(),
    emailVerified: z.boolean().optional(),
    phoneNumberVerified: z.boolean().optional(),
    banned: z.boolean().optional(),
});

export type FilterUserSchema = z.infer<typeof filterUserSchema>;