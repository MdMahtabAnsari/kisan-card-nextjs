"use client"
import { GenericAreaChart, GenericAreaChartSkeleton } from "@/components/chart/area.chart";
import { useState } from "react";
import { api } from "@/trpc/react";
import { DayEnum } from "@/lib/schema/common/day";
import { Error } from "@/components/error/error";


export function CardTypeChart() {
    const [timeRange, setTimeRange] = useState<DayEnum>("30");

    const { data, isPending, isError, error, refetch } = api.admin.card.getCardTypeOverTime.useQuery(timeRange)

    if (isPending || !data) {
        return <GenericAreaChartSkeleton />;
    }
    if (isError) {
        return <Error title="Error while loading Stats" description={error.message} onRetry={refetch} />;
    }

    const onTimeRangeChange = (value: string) => {
        setTimeRange(value as DayEnum);
    }
    return (

        <GenericAreaChart
            data={data}
            series={[
                { key: "standard", label: "Standard", colorVar: "--chart-1" },
                { key: "premium", label: "Premium", colorVar: "--chart-2" },
                { key: "vip", label: "VIP", colorVar: "--chart-3" },
            ]}
            title="Card Types Over Time"
            description="Number of cards of each type over time."
            initialTimeRange={timeRange}
            onTimeRangeChange={onTimeRangeChange}
        />
    );
}