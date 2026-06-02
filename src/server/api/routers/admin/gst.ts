import { router, adminProcedure } from "@/server/api/trpc";
import { GstService } from "@/services/admin/gst.service";
import { inferRouterOutputs, TRPCError } from "@trpc/server";
import { auth } from "@/lib/auth/auth";
import { infiniteScrollWithSearch } from "@/lib/schema/common/page";
import { UserRole } from "@/generated/prisma/client";

export const gstRouter = router({
   getGstInfiniteScroll: adminProcedure.input(infiniteScrollWithSearch).query(async ({ ctx, input }) => {
        try {
            const user = ctx.session.user;
            const hasPermission = await auth.api.userHasPermission({
                body: {
                    userId: user.id,
                    role: user.role as UserRole,
                    permissions: {
                        "stateGst": ["read"]
                    }
                }
            })
            if (!hasPermission.success) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You do not have permission to read GST information."
                });
            }
            const prisma = ctx.prisma;
            const gstService = new GstService(prisma);
            return await gstService.getGstInfiniteScroll(input);
        }
        catch (error) {
            console.error("Error fetching GSTs with infinite scroll:", error);
            if (error instanceof TRPCError) {
                throw error;
            }
            const message = error instanceof Error ? error.message : "Unknown error";
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Failed to fetch GSTs: ${message}`,
            });
        }
    }),
});


export type GstRouterOutput = inferRouterOutputs<typeof gstRouter>;