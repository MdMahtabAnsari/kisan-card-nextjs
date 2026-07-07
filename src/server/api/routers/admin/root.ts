import { router } from "@/server/api/trpc";
import {userRouter} from "@/server/api/routers/admin/user";
import { cardRouter } from "@/server/api/routers/admin/card";
import { revenueRouter } from "@/server/api/routers/admin/revenue";
import { shopRouter } from "@/server/api/routers/admin/shop";
import {categoryRouter} from "@/server/api/routers/admin/category";
import {gstRouter} from "@/server/api/routers/admin/gst";
import {rechargeRouter} from "@/server/api/routers/admin/recharge";


export const adminRouter = router({
    // Define admin-specific procedures here
    user: userRouter,
    card: cardRouter,
    revenue: revenueRouter,
    shop: shopRouter,
    category: categoryRouter,
    gst: gstRouter,
    recharge:rechargeRouter
});