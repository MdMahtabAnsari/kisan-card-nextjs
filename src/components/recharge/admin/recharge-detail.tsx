"use client";
import {api} from "@/trpc/react"
import {RechargeCard,RechargeCardSkeleton} from "@/components/recharge/recharge-card";
import {Error} from "@/components/error/error"

interface RechargeDetail{
    id:string
}

export function RechargeDetail({id}:RechargeDetail){

    const {data,isPending,isError,error,refetch} = api.admin.recharge.getRecharge.useQuery(id);

    return(
        isPending ? (
            <RechargeCardSkeleton  />
        ) : isError ? (
            <Error title="Error while fetching recharge" description={error.message} onRetry={refetch} />
        ) : (
            <RechargeCard recharge={data} />
        )
    )

}