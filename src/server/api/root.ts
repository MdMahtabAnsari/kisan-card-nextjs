import { createCallerFactory, router } from "@/server/api/trpc";
import {adminRouter} from "@/server/api/routers/admin/root";
import {commonRouter} from "@/server/api/routers/common/root";


export const appRouter = router({
    admin: adminRouter,
    common: commonRouter
});


export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
