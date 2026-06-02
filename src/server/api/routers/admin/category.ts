import { router, adminProcedure } from "@/server/api/trpc";
import {CategoryService} from "@/services/admin/category.service";
import { inferRouterOutputs, TRPCError } from "@trpc/server";
import { auth } from "@/lib/auth/auth";
import { infiniteScrollWithSearch } from "@/lib/schema/common/page";
import { UserRole } from "@/generated/prisma/client";

export const categoryRouter = router({
   getCategoriesInfiniteScroll: adminProcedure.input(infiniteScrollWithSearch).query(async ({ ctx, input }) => {
        try {
            const user = ctx.session.user;
            const hasPermission = await auth.api.userHasPermission({
                body: {
                    userId: user.id,
                    role: user.role as UserRole,
                    permissions: {
                        "category": ["read"]
                    }
                }
            })
            if (!hasPermission.success) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You do not have permission to read category information."
                });
            }
            const prisma = ctx.prisma;
            const categoryService = new CategoryService(prisma);
            return await categoryService.getCategoriesInfiniteScroll(input);
        }
        catch (error) {
            console.error("Error fetching categories with infinite scroll:", error);
            if (error instanceof TRPCError) {
                throw error;
            }
            const message = error instanceof Error ? error.message : "Unknown error";
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Failed to fetch categories: ${message}`,
            });
        }
    }),
});


export type CategoryRouterOutput = inferRouterOutputs<typeof categoryRouter>;