import { createCallerFactory, router } from "@/server/api/trpc";
import {adminRouter} from "@/server/api/routers/admin/root";


export const appRouter = router({
    admin: adminRouter,
    
});


export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
