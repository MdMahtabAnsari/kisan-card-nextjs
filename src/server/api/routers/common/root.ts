import { router } from "@/server/api/trpc";
import {exchangeRouter} from "@/server/api/routers/common/exchnage";


export const commonRouter = router({
    exchange: exchangeRouter
});