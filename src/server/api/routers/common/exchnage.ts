import { router, protectedProcedure } from "@/server/api/trpc";
import {ExchangeService} from "@/services/common/exchange.service";
import {inferRouterOutputs, TRPCError} from "@trpc/server";
import {cardTypeWithIsActiveSchema} from "@/lib/schema/common/exchange";

export const exchangeRouter = router({
    getExchange:protectedProcedure.input(cardTypeWithIsActiveSchema).query(async({ctx,input})=>{
        try{
            const prisma = ctx.prisma;
            const exchangeService = new ExchangeService(prisma);
            return await exchangeService.getExchange(input);
        }catch (error) {
            console.error("Error fetching exchange:", error);
            if (error instanceof TRPCError) {
                throw error;
            }
            const message = error instanceof Error ? error.message : "Unknown error";
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Failed to fetch exchange: ${message}`,
            });
        }
    })
})

export type ExchangeRouterOutput = inferRouterOutputs<typeof exchangeRouter>;