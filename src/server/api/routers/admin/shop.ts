import { router, adminProcedure } from "@/server/api/trpc";
import { ShopService } from "@/services/admin/shop.service";
import { TRPCError } from "@trpc/server";
import { auth } from "@/lib/auth/auth";
import { UserRole } from "@/generated/prisma/client";

export const shopRouter = router({
    getMonthlyRegistrations: adminProcedure.query(async ({ ctx }) => {
        try {
            const user = ctx.session.user;
            const hasPermission = await auth.api.userHasPermission({
                body: {
                    userId: user.id,
                    role: user.role as UserRole,
                    permissions: {
                        "shop": ["read"]
                    }
                }
            })
            if (!hasPermission.success) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You do not have permission to read shop information."
                });
            }
            const prisma = ctx.prisma;
            const shopService = new ShopService(prisma);
            return await shopService.getMonthlyRegistrations();
        }
        catch (error) {
            console.error("Error fetching monthly registrations:", error);
            if (error instanceof TRPCError) {
                throw error;
            }
            const message = error instanceof Error ? error.message : "Unknown error";
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Failed to fetch monthly registrations: ${message}`,
            });
        }
    })
});