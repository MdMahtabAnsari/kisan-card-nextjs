import { router, adminProcedure } from "@/server/api/trpc";
import {createRechargeSchema,createPaymentSchema,verifyPaymentSchema} from "@/lib/schema/common/recharge";
import { inferRouterOutputs, TRPCError } from "@trpc/server";
import {auth} from "@/lib/auth/auth";
import {UserRole} from "@/generated/prisma/enums";
import {RechargeService} from "@/services/common/recharge.service";
import {RechargeService as AdminRechargeService} from "@/services/admin/recharge.service"
import {id} from "@/lib/schema/common/common"

export const rechargeRouter = router({
    recharge: adminProcedure.input(createRechargeSchema).mutation(async ({input, ctx}) => {
        try {
            const user = ctx.session.user;
            const hasPermission = await auth.api.userHasPermission({
                body: {
                    userId: user.id,
                    role: user.role as UserRole,
                    permissions: {
                        "recharge": ["create"]
                    }
                }
            })
            if (!hasPermission.success) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You do not have permission to create a recharge."
                });
            }
            const prisma = ctx.prisma;
            const rechargeService = new RechargeService(prisma);
            return await rechargeService.createRecharge({data: input, userId: user.id});

        } catch (error) {
            console.error("Error creating recharge:", error);
            if (error instanceof TRPCError) {
                throw error;
            }
            const message = error instanceof Error ? error.message : "Unknown error";
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Failed to create recharge: ${message}`,
            });
        }
    }),
    payment: adminProcedure.input(createPaymentSchema).mutation(async ({input, ctx}) => {
        try {
            const user = ctx.session.user;
            const hasPermission = await auth.api.userHasPermission({
                body: {
                    userId: user.id,
                    role: user.role as UserRole,
                    permissions: {
                        "recharge": ["create"]
                    }
                }
            })
            if (!hasPermission.success) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You do not have permission to create a payment."
                });
            }
            const prisma = ctx.prisma;
            return await prisma.$transaction(async (tx) => {
                const rechargeService = new RechargeService(tx);
                return await rechargeService.createPayment(input);
            })

        } catch (error) {
            console.error("Error creating payment:", error);
            if (error instanceof TRPCError) {
                throw error;
            }
            const message = error instanceof Error ? error.message : "Unknown error";
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Failed to create payment: ${message}`,
            });
        }
    }),
    verifyPayment:adminProcedure.input(verifyPaymentSchema).mutation(async ({input, ctx}) => {
        try {
            const user = ctx.session.user;
            const hasPermission = await auth.api.userHasPermission({
                body: {
                    userId: user.id,
                    role: user.role as UserRole,
                    permissions: {
                        "recharge": ["create"]
                    }
                }
            })
            if (!hasPermission.success) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You do not have permission to verify a payment."
                });
            }
            const prisma = ctx.prisma;
            return await prisma.$transaction(async (tx) => {
                const rechargeService = new RechargeService(tx);
                return await rechargeService.verifyPayment(input);
            })
        }catch(error){
            console.error("Error verifying payment:", error);
            if (error instanceof TRPCError) {
                throw error;
            }
            const message = error instanceof Error ? error.message : "Unknown error";
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Failed to verify payment: ${message}`,
            });
        }
    }),
    getRecharge:adminProcedure.input(id).query(async ({input,ctx})=>{
        try {
            const user = ctx.session.user;
            const hasPermission = await auth.api.userHasPermission({
                body: {
                    userId: user.id,
                    role: user.role as UserRole,
                    permissions: {
                        "recharge": ["read"]
                    }
                }
            })
            if (!hasPermission.success) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You do not have permission to read recharge."
                });
            }
            const prisma = ctx.prisma;
            const rechargeService = new AdminRechargeService(prisma);
            return await rechargeService.getRecharge(input)
        }catch(error){
            console.error("Error getting recharge:", error);
            if (error instanceof TRPCError) {
                throw error;
            }
            const message = error instanceof Error ? error.message : "Unknown error";
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Failed to get recharge: ${message}`,
            });
        }

    })
})

export type RechargeRouterOutput = inferRouterOutputs<typeof rechargeRouter>

