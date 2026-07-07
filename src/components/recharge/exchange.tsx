"use client"
import {ExchangeCard,ExchangeCardSkeleton} from "@/components/recharge/exchange-card";
import {api} from "@/trpc/react";
import {CardType} from "@/generated/prisma/enums";
import {Error} from "@/components/error/error"

interface ExchangeProps{
    type:CardType,
    amount:number,
    points:number
}


export function Exchange({type,amount,points}:ExchangeProps) {
    const {data, isPending, isError, error, refetch} = api.common.exchange.getExchange.useQuery({
        type,
        isActive: true
    });




    return (
        isPending ? (
            <ExchangeCardSkeleton  />
        ) : isError ? (
            <Error title="Error while fetching exchnage rate" description={error.message} onRetry={refetch} />
        ) : (
            <ExchangeCard exchange={data} currentPoints={points} amount={amount} />
        )
    )
}