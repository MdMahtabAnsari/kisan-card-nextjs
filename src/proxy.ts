import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth/auth";
import { UserRole } from "@/generated/prisma/client";

/**
 * Public routes
 */
const publicRoutes = ["/"];


/**
 * Role routes
 */
const roleRoutes: Record<UserRole, string> = {
    ADMIN: "/admin",
    USER: "/user",
    SHOP_MANAGER: "/shop-manager",
    WAREHOUSE_MANAGER: "/warehouse-manager",
};

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    /**
     * Public route
     */
    const isPublicRoute = publicRoutes.includes(pathname);

    /**
     * Auth route
     */
    const isAuthRoute =
        pathname === "/auth" ||
        pathname.startsWith("/auth/");

    /**
     * Get session
     */
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    /**
     * Allow public routes
     */
    if (isPublicRoute) {
        return NextResponse.next();
    }

    /**
     * Prevent authenticated users
     * from accessing auth routes
     */
    if (session && isAuthRoute) {
        const role = session.user.role as UserRole;

        return NextResponse.redirect(
            new URL(
                `${roleRoutes[role]}/dashboard`,
                request.url
            )
        );
    }

    /**
     * Redirect unauthenticated users
     */
    if (!session && !isAuthRoute) {
        return NextResponse.redirect(
            new URL("/auth/sign-in", request.url)
        );
    }

    /**
     * Role-based protection
     */
    if (session) {
        const role = session.user.role as UserRole;

        const allowedPrefix = roleRoutes[role];

        const protectedRoleRoutes =
            Object.values(roleRoutes);

        const isRoleRoute = protectedRoleRoutes.some(
            (route) => pathname.startsWith(route)
        );

        /**
         * Prevent access
         * to another role routes
         */
        if (
            isRoleRoute &&
            !pathname.startsWith(allowedPrefix)
        ) {
            return NextResponse.redirect(
                new URL(
                    `${allowedPrefix}/dashboard`,
                    request.url
                )
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api/auth|api/sign-cloudinary-params|api/panel|_next|favicon.ico|.*\\..*).*)",
    ],
};