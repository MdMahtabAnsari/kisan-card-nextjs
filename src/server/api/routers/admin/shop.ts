import { router, adminProcedure } from "@/server/api/trpc";
import { ShopService } from "@/services/admin/shop.service";
import { TRPCError } from "@trpc/server";
import { auth } from "@/lib/auth/auth";
import { UserRole } from "@/generated/prisma/client";
import {createShopBackEndSchema,filterShopInfiniteScrollSchema} from "@/lib/schema/admin/shop";
import {statusEnum} from "@/lib/schema/common/status";
import {dayEnum} from "@/lib/schema/common/day";

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
    }),
    createShop: adminProcedure.input(createShopBackEndSchema).mutation(async ({ ctx, input }) => {
        try {
            const user = ctx.session.user;
            const hasPermission = await auth.api.userHasPermission({
                body: {
                    userId: user.id,
                    role: user.role as UserRole,
                    permissions: {
                        "shop": ["create"]
                    }
                }
            })
            if (!hasPermission.success) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You do not have permission to create a shop."
                });
            }
            const prisma = ctx.prisma;
            return await prisma.$transaction(async (tx) => {
                const shopService = new ShopService(tx);
                return await shopService.createShop(user.id, input);
            });
        }
        catch (error) {
            console.error("Error creating shop:", error);
            if (error instanceof TRPCError) {
                throw error;
            }
            const message = error instanceof Error ? error.message : "Unknown error";
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Failed to create shop: ${message}`,
            });
        }
    }),
    getShopsInfiniteScroll: adminProcedure.input(filterShopInfiniteScrollSchema).query(async ({ ctx,input }) => {
        try{
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
            return await shopService.getShopsInfiniteScroll(input);
        }catch(error) {
            console.error("Error creating shop:", error);
            if (error instanceof TRPCError) {
                throw error;
            }
            const message = error instanceof Error ? error.message : "Unknown error";
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Failed to fetch shop: ${message}`,
            })
        }
    }),
    getMonthlyShops:adminProcedure.input(statusEnum.optional()).query(async ({ ctx, input }) => {
        try{
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
            return await shopService.getMonthlyShops(input);
        }catch(error) {
            console.error("Error creating monthly registration:", error);
            if (error instanceof TRPCError) {
                throw error;
            }
            const message = error instanceof Error ? error.message : "Unknown error";
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Failed to fetch monthly registration: ${message}`,
            })
        }
    }),
    getRegistrationsOverTime:adminProcedure.input(dayEnum).query(async ({ ctx, input }) => {
        try{
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
            return await shopService.getRegistrationsOverTime(input);
        }catch(error) {
            console.error("Error creating registration:", error);
            if (error instanceof TRPCError) {
                throw error;
            }
            const message = error instanceof Error ? error.message : "Unknown error";
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Failed to fetch registration: ${message}`,
            })
        }
    })
});