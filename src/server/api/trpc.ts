import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@/lib/auth/auth";
import { type NextRequest } from "next/server";
import superjson from "superjson";
import { ZodError, z } from "zod";
import { prisma } from "@/lib/db/prisma";
import {UserRole} from "@/generated/prisma/client";

export async function createContext(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: req.headers,
    });

    return {
        session,
        prisma,
    };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
    transformer: superjson,

    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError
                        ? z.treeifyError(error.cause)
                        : null,
            },
        };
    },
});

export const router = t.router;
export const middleware = t.middleware;
export const createCallerFactory = t.createCallerFactory;

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

const isAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.session?.user || !ctx.session?.session) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in",
        });
    }

    return next({
        ctx: {
            ...ctx,
            session: ctx.session,
        },
    });
});

const isNotBanned = t.middleware(({ ctx, next }) => {
    if (ctx.session?.user?.banned) {
        throw new TRPCError({
            code: "FORBIDDEN",
            message: "Your account is banned",
        });
    }

    return next();
});

/* -------------------------------------------------------------------------- */
/*                              Protected Procedure                           */
/* -------------------------------------------------------------------------- */

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure
    .use(isAuthed)
    .use(isNotBanned);

/* -------------------------------------------------------------------------- */
/*                               Role Middleware                              */
/* -------------------------------------------------------------------------- */

const roleMiddleware = (roles: string[]) =>
    t.middleware(({ ctx, next }) => {
        const userRole = ctx.session?.user?.role;

        if (!userRole || !roles.includes(userRole)) {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "You do not have permission",
            });
        }

        return next();
    });

/* -------------------------------------------------------------------------- */
/*                               Role Procedures                              */
/* -------------------------------------------------------------------------- */

export const adminProcedure = protectedProcedure.use(
    roleMiddleware([UserRole.ADMIN])
);

export const shopManagerProcedure = protectedProcedure.use(
    roleMiddleware([UserRole.SHOP_MANAGER])
);

export const warehouseManagerProcedure = protectedProcedure.use(
    roleMiddleware([UserRole.WAREHOUSE_MANAGER])
);

export const userProcedure = protectedProcedure.use(
    roleMiddleware([UserRole.USER])
);