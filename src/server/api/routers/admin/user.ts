import { router, adminProcedure } from "@/server/api/trpc";
import { UserService } from "@/services/admin/user.service";
import { TRPCError } from "@trpc/server";
import { auth } from "@/lib/auth/auth";
import { UserRole } from "@/generated/prisma/client";
import { dayEnum } from "@/lib/schema/day";
import { filterUserSchema } from "@/lib/schema/admin/user";
import { inferRouterOutputs } from "@trpc/server";

export const userRouter = router({
    getMonthlyRegistrations: adminProcedure.query(async ({ ctx }) => {
        try {
            const user = ctx.session.user;
            const hasPermission = await auth.api.userHasPermission({
                body: {
                    userId: user.id,
                    role: user.role as UserRole,

                    permissions: {
                        "user": ["get"]
                    }
                }
            })
            if (!hasPermission.success) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You do not have permission to read user information."
                });
            }
            const prisma = ctx.prisma;
            const userService = new UserService(prisma);
            return await userService.getMonthlyRegistrations();
        }
        catch (error) {
            console.error("Error fetching monthly user registrations:", error);
            if (error instanceof TRPCError) {
                throw error;
            }
            const message = error instanceof Error ? error.message : "Unknown error";
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Failed to fetch monthly user registrations: ${message}`,
            });
        }
    }),
    getRegistrationsOverTime: adminProcedure.input(dayEnum).query(async ({ ctx, input }) => {
        try {
            const user = ctx.session.user;
            const hasPermission = await auth.api.userHasPermission({
                body: {
                    userId: user.id,
                    role: user.role as UserRole,
                    permissions: {
                        "user": ["get"]
                    }
                }
            })
            if (!hasPermission.success) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You do not have permission to read user information."
                });
            }
            const prisma = ctx.prisma;
            const userService = new UserService(prisma);
            return await userService.getRegistrationsOverTime(input);
        }
        catch (error) {
            console.error("Error fetching user registrations over time:", error);
            if (error instanceof TRPCError) {
                throw error;
            }
            const message = error instanceof Error ? error.message : "Unknown error";
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Failed to fetch user registrations over time: ${message}`,
            });
        }
    }),
    getUsers: adminProcedure.input(filterUserSchema).query(async ({ ctx, input }) => {
        try {
            const user = ctx.session.user;
            const hasPermission = await auth.api.userHasPermission({
                body: {
                    userId: user.id,
                    role: user.role as UserRole,
                    permissions: {
                        "user": ["get"]
                    }
                }
            })
            if (!hasPermission.success) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You do not have permission to read user information."
                });
            }
            const prisma = ctx.prisma;
            const userService = new UserService(prisma);
            return await userService.getUsers(input);
        }
        catch (error) {
            console.error("Error fetching users:", error);
            if (error instanceof TRPCError) {
                throw error;
            }
            const message = error instanceof Error ? error.message : "Unknown error";
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Failed to fetch users: ${message}`,
            });
        }
    }),

});


export type UserRouterOutput = inferRouterOutputs<typeof userRouter>;