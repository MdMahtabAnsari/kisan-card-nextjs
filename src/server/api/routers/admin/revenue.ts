import { router, adminProcedure } from "@/server/api/trpc";
import { RevenueService } from "@/services/admin/revenue.service";
import { TRPCError } from "@trpc/server";
import { auth } from "@/lib/auth/auth";
import { UserRole } from "@/generated/prisma/client";

export const revenueRouter = router({
    getMonthlyRevenue: adminProcedure.query(async ({ ctx }) => {
        try {
            const user = ctx.session.user;
            const hasPermission = await auth.api.userHasPermission({
                body: {
                    userId: user.id,
                    role: user.role as UserRole,
                    permissions: {
                        "transaction": ["read"]
                    }
                }
            })
            if (!hasPermission.success) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You do not have permission to read transaction information."
                });
            }
            const prisma = ctx.prisma;
            const revenueService = new RevenueService(prisma);
            return await revenueService.getMonthlyRevenue();
        }
        catch (error) {
            console.error("Error fetching monthly revenue:", error);
            if (error instanceof TRPCError) {
                throw error;
            }
            const message = error instanceof Error ? error.message : "Unknown error";
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Failed to fetch monthly revenue: ${message}`,
            });
        }
    })
});