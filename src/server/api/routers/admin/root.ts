import { router } from "@/server/api/trpc";
import {userRouter} from "@/server/api/routers/admin/user";
import { cardRouter } from "@/server/api/routers/admin/card";
import { revenueRouter } from "@/server/api/routers/admin/revenue";
import { shopRouter } from "@/server/api/routers/admin/shop";


export const adminRouter = router({
    // Define admin-specific procedures here
    user: userRouter,
    card: cardRouter,
    revenue: revenueRouter,
    shop: shopRouter,
});