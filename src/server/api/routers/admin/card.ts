import { router, adminProcedure } from "@/server/api/trpc";
import { CardService } from "@/services/admin/card.service";
import { TRPCError } from "@trpc/server";
import { auth } from "@/lib/auth/auth";
import { UserRole } from "@/generated/prisma/client";
import { statusEnum } from "@/lib/schema/common/status";
import { dayEnum } from "@/lib/schema/common/day";
import { inferRouterOutputs } from "@trpc/server";
import { filterCardSchema } from "@/lib/schema/admin/card";
import { cardStatusUpdateSchema } from "@/lib/schema/common/card";
import {createCardSchema} from "@/lib/schema/admin/card";

export const cardRouter = router({
    getMonthlyCards: adminProcedure.input(statusEnum.optional()).query(async ({ ctx, input }) => {
        try {
            const user = ctx.session.user;
            const hasPermission = await auth.api.userHasPermission({
                body: {
                    userId: user.id,
                    role: user.role as UserRole,
                    permissions: {
                        "card": ["read"]
                    }
                }
            })
            if (!hasPermission.success) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You do not have permission to read card information."
                });
            }
            const prisma = ctx.prisma;
            const cardService = new CardService(prisma);
            return await cardService.getMonthlyCards(input);
        }
        catch (error) {
            console.error("Error fetching monthly cards:", error);
            if (error instanceof TRPCError) {
                throw error;
            }
            const message = error instanceof Error ? error.message : "Unknown error";
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Failed to fetch monthly cards: ${message}`,
            });
        }
    }),

    getCardTypeOverTime: adminProcedure.input(dayEnum).query(async ({ ctx, input }) => {
        try {
            const user = ctx.session.user;
            const hasPermission = await auth.api.userHasPermission({
                body: {
                    userId: user.id,
                    role: user.role as UserRole,
                    permissions: {
                        "card": ["read"]
                    }
                }
            });
            if (!hasPermission.success) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You do not have permission to read card information."
                });
            }
            const prisma = ctx.prisma;
            const cardService = new CardService(prisma);
            return await cardService.getCardTypeOverTime(input);
        } catch (error) {
            console.error("Error fetching card type overview:", error);
            if (error instanceof TRPCError) {
                throw error;
            }
            const message = error instanceof Error ? error.message : "Unknown error";
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Failed to fetch card type overview: ${message}`,
            });
        }
    }),

    getCards: adminProcedure.input(filterCardSchema).query(async ({ ctx, input }) => {
        try {
            const user = ctx.session.user;
            const hasPermission = await auth.api.userHasPermission({
                body: {
                    userId: user.id,
                    role: user.role as UserRole,
                    permissions: {
                        "card": ["read"]
                    }
                }
            });
            if (!hasPermission.success) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You do not have permission to read card information."
                });
            }
            const prisma = ctx.prisma;
            const cardService = new CardService(prisma);
            return await cardService.getCards(input);
        } catch (error) {
            console.error("Error fetching cards:", error);
            if (error instanceof TRPCError) {
                throw error;
            }
            const message = error instanceof Error ? error.message : "Unknown error";
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Failed to fetch cards: ${message}`,
            });
        }
    }),
    updateCardStatus: adminProcedure.input(cardStatusUpdateSchema).mutation(async ({ ctx, input }) => {
        try {

            const user = ctx.session.user;
            const hasPermission = await auth.api.userHasPermission({
                body: {
                    userId: user.id,
                    role: user.role as UserRole,
                    permissions: {
                        "cardStatus": ["update"]
                    }
                }
            });
            if (!hasPermission.success) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You do not have permission to update card status."
                });
            }
            const prisma = ctx.prisma;
            return await prisma.$transaction(async (tx) => {
                const cardService = new CardService(tx);
                return await cardService.updateCardStatus({ ...input, userId: user.id });
            })

        } catch (error) {
            console.error("Error updating card status:", error);
            if (error instanceof TRPCError) {
                throw error;
            }
            const message = error instanceof Error ? error.message : "Unknown error";
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Failed to update card status: ${message}`,
            });
        }
    }),

    createCard:adminProcedure.input(createCardSchema).mutation(async ({ ctx, input }) => {
        try{
            const user = ctx.session.user;
            const hasPermission = await auth.api.userHasPermission({
                body: {
                    userId: user.id,
                    role: user.role as UserRole,
                    permissions: {
                        "card": ["create"]
                    }
                }
            });
            if (!hasPermission.success) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You do not have permission to create card information."
                });
            }
            const prisma = ctx.prisma;
            return await prisma.$transaction(async (tx) => {
                const cardService = new CardService(tx);
                return await cardService.createCard(user.id, input);
            })
        }catch(error) {
            console.error("Error updating card status:", error);
            if (error instanceof TRPCError) {
                throw error;
            }
            const message = error instanceof Error ? error.message : "Unknown error";
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Failed to create card status: ${message}`,
            })
        }
    })
});


export type CardRouterOutput = inferRouterOutputs<typeof cardRouter>;