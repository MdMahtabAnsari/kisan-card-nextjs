import { router, adminProcedure } from "@/server/api/trpc";
import { UserService } from "@/services/admin/user.service";
import { TRPCError } from "@trpc/server";
import { auth } from "@/lib/auth/auth";
import { UserRole } from "@/generated/prisma/client";
import { dayEnum } from "@/lib/schema/common/day";
import { filterUserSchema } from "@/lib/schema/admin/user";
import { inferRouterOutputs } from "@trpc/server";
import { createUserSchema } from "@/lib/schema/admin/user";
import { AddressService } from "@/services/common/address.service";
import { DocumentService } from "@/services/common/document.service";
import { MediaService } from "@/services/common/media.service";
import { infiniteScrollWithSearch } from "@/lib/schema/common/page";
import { userStatusUpdateSchema } from "@/lib/schema/common/user";

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

    createUser: adminProcedure.input(createUserSchema).mutation(async ({ ctx, input }) => {
        const { name, email, password, image, phoneNumber, username, displayUsername, role, aadhaarNumber, address, aadhaarFront, aadhaarBack } = input
        try {
            const user = ctx.session.user;
            const hasPermission = await auth.api.userHasPermission({
                body: {
                    "userId": user.id,
                    "role": user.role as UserRole,
                    "permissions": {
                        "user": ["create"]
                    }
                }
            });
            if (!hasPermission.success) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You do not have permission to create users."
                });
            }
            const prisma = ctx.prisma;
            return await prisma.$transaction(async (tx) => {
                const addressService = new AddressService(tx);
                const mediaService = new MediaService(tx);
                const documentService = new DocumentService(tx);
                const userService = new UserService(tx);
                const createdUser = await auth.api.createUser({
                    body: {
                        email: email,
                        password: password,
                        name: name,
                        role: role,
                        data: {
                            aadhaarNumber: aadhaarNumber,
                            username: username,
                            displayUsername: displayUsername,
                            image: image,
                            phoneNumber: phoneNumber
                        }

                    }
                });
                const createdAddress = await addressService.createAddress(address);
                await addressService.createUserAddress(createdUser.user.id, createdAddress.id);
                const createdAadhaarFrontMedia = await mediaService.createMedia(aadhaarFront);
                const createdAadhaarBackMedia = await mediaService.createMedia(aadhaarBack);
                await documentService.createDocument({
                    type: "AADHAAR_FRONT",
                    mediaId: createdAadhaarFrontMedia.id,
                    userId: createdUser.user.id,
                    createdById: user.id
                });
                await documentService.createDocument({
                    type: "AADHAAR_BACK",
                    mediaId: createdAadhaarBackMedia.id,
                    userId: createdUser.user.id,
                    createdById: user.id
                });
                await userService.createUserStatus({
                    userId: createdUser.user.id,
                    status: "PENDING",
                    createdById: user.id,
                    notes: "User created and pending verification"
                });
                return createdUser;
            });
        }
        catch (error) {
            console.error("Error creating user:", error);
            if (error instanceof TRPCError) {
                throw error;
            }
            const message = error instanceof Error ? error.message : "Unknown error";
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Failed to create user: ${message}`,
            });
        }
    }),

    getNonAssignedShopManagersInfiniteScroll: adminProcedure.input(infiniteScrollWithSearch).query(async ({ ctx, input }) => {
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
            return await userService.getNonAssignedShopManagersInfiniteScroll(input);
        }
        catch (error) {
            console.error("Error fetching non-assigned shop managers:", error);
            if (error instanceof TRPCError) {
                throw error;
            }
            const message = error instanceof Error ? error.message : "Unknown error";
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Failed to fetch non-assigned shop managers: ${message}`,
            });
        }
    }),

    updateUserStatus: adminProcedure.input(userStatusUpdateSchema).mutation(async ({ ctx, input }) => {
        try {
            const user = ctx.session.user;
            const hasPermission = await auth.api.userHasPermission({
                body: {
                    userId: user.id,
                    role: user.role as UserRole,
                    permissions: {
                        "userStatus": ["update"]
                    }
                }
            })
            if (!hasPermission.success) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You do not have permission to update user status."
                })
            }
            const prisma = ctx.prisma;
            return await prisma.$transaction(async (tx) => {
                const userService = new UserService(tx);
                return await userService.updateUserStatus({
                    ...input, createdById: user.id
                });
            })

        } catch (error) {
            console.error("Error updating user status:", error);
            if (error instanceof TRPCError) {
                throw error;
            }
            const message = error instanceof Error ? error.message : "Unknown error";
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Failed to update user status: ${message}`,
            });
        }
    }),

    getUsersWithoutActiveCardInfiniteScroll:adminProcedure.input(infiniteScrollWithSearch).query(async ({ ctx, input }) => {
        try{
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
            return await userService.getUsersWithoutActiveCardInfiniteScroll(input);
        }catch(error) {
            console.error("Error updating user status:", error);
            if (error instanceof TRPCError) {
                throw error;
            }

            const message = error instanceof Error ? error.message : "Unknown error";
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Failed to fetch non-assigned shop managers: ${message}`,
            })
        }
    }),
});



export type UserRouterOutput = inferRouterOutputs<typeof userRouter>;