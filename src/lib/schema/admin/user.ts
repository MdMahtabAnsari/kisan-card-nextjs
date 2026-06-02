import { z } from "zod";
import { pageLimitSchema } from "@/lib/schema/common/page";
import { SortOrder } from "@/lib/types/sort";
import { StatusType, UserRole } from "@/generated/prisma/browser";
import { addressSchema } from "@/lib/schema/common/address";
import {mediaSchema} from "@/lib/schema/common/media";
import { infiniteScroll } from "@/lib/schema/common/page";



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
    status: z.array(z.enum(StatusType)).optional(),
});

export type FilterUserSchema = z.infer<typeof filterUserSchema>;


export const createUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long").max(100, "Name must be less than 100 characters long"),
    email: z.email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long").max(255, "Password must be less than 255 characters long"),
    image: z.url("Invalid URL format"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 characters long").max(20, "Phone number must be less than 20 characters long").regex(/^[0-9+\s-]*$/, "Phone number can only contain numbers, spaces, plus signs and hyphens"),
    username: z.string().min(3, "Username must be at least 3 characters long").max(50, "Username must be less than 50 characters long").regex(/^[a-zA-Z0-9_-]*$/, "Username can only contain letters, numbers, underscores and hyphens"),
    displayUsername: z.string().min(3, "Display username must be at least 3 characters long").max(50, "Display username must be less than 50 characters long").regex(/^[a-zA-Z0-9\s_-]*$/, "Display username can only contain letters, numbers, spaces, underscores and hyphens"),
    role: z.enum(UserRole),
    aadhaarNumber: z.string().min(12, "Aadhaar number must be at least 12 characters long").max(12, "Aadhaar number must be exactly 12 characters long").regex(/^[0-9]*$/, "Aadhaar number can only contain numbers"),
    address: addressSchema,
    aadhaarFront: mediaSchema,
    aadhaarBack: mediaSchema,
});

export type CreateUserForm = z.infer<typeof createUserSchema>;

export const filterUserInfiniteScrollSchema = filterUserSchema.omit({pageLimit: true}).extend(infiniteScroll.shape);

export type FilterUserInfiniteScrollSchema = z.infer<typeof filterUserInfiniteScrollSchema>;