import { betterAuth } from "better-auth";
import { phoneNumber, username, emailOTP, twoFactor, admin as adminPlugin, multiSession, magicLink, lastLoginMethod, openAPI } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db/prisma";
import { nextCookies } from "better-auth/next-js";
import { authEmailService } from "@/services/emails/auth.email.service";
import { admin, user, shopManager, warehouseManager, ac } from "@/lib/auth/permissions/admin.permission";
import { UserRole } from "@/generated/prisma/client";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        // disableSignUp: true,
        requireEmailVerification: true,
        enabled: true,
        sendResetPassword: async ({ user, url }) => {
            await authEmailService.sendResetPasswordEmail({ user, url });
        }
    },
    user: {
        changeEmail: {
            enabled: true,
            sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
                await authEmailService.sendChangeEmailEmail({ email: newEmail, url, user });
            }
        },
        additionalFields: {
            aadhaarNumber: {
                type: "string",
                required: false,
                unique: true,
                input: true
            }
        }
    },

    emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url, token }) => {
            await authEmailService.sendVerificationEmail({ user, url, token });
        },
        afterEmailVerification: async (user) => {
            await authEmailService.sendWelcomeEmail({ user });
        }
    },
    account: {
        accountLinking: {
            enabled: true,
        }
    },
    plugins: [
        multiSession(),
        magicLink({
            // disableSignUp: true,
            sendMagicLink: async ({ email, url }) => {
                await authEmailService.sendMagicLinkEmail({ email, url });
            }
        }),
        phoneNumber(),
        username(),
        emailOTP({
            // disableSignUp: true,
            changeEmail: {
                enabled: true,
            },
            async sendVerificationOTP({ email, otp, type }) {
                if (type === "sign-in") {
                    await authEmailService.sendSignInOTPEmail({ email, otp });
                }
                else if (type === "email-verification") {
                    await authEmailService.sendEmailVerificationOTPEmail({ email, otp });
                }
                else if (type === "forget-password") {
                    await authEmailService.sendResetPasswordOTPEmail({ email, otp });
                }
                else {
                    await authEmailService.sendChangeEmailOTPEmail({ email, otp });
                }

            },
        }),
        twoFactor({
            issuer: "KisanCard",
            otpOptions: {
                sendOTP: async ({ user, otp }) => {
                    await authEmailService.sendOTPEmail({ user, otp });
                }
            }
        }),
        adminPlugin({
            defaultRole: UserRole.USER,
            ac,
            roles: {
                [UserRole.ADMIN]: admin,
                [UserRole.USER]: user,
                [UserRole.SHOP_MANAGER]: shopManager,
                [UserRole.WAREHOUSE_MANAGER]: warehouseManager
            }
        }),
        
        lastLoginMethod(),
        openAPI(),
        nextCookies(),
    ],
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 //seconds
        }
    },
    secret: process.env.BETTER_AUTH_SECRET || "fVupgbkbjwvTVW7N09gKAn6wRm2q4sh1",
    trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],
});