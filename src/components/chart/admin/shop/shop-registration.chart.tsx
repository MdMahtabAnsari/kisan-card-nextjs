"use client"
import { GenericAreaChart, GenericAreaChartSkeleton } from "@/components/chart/area.chart";
import { useState } from "react";
import { api } from "@/trpc/react";
import { DayEnum } from "@/lib/schema/common/day";
import { Error } from "@/components/error/error";


export function ShopRegistrationChart() {
    const [timeRange, setTimeRange] = useState<DayEnum>("30");

    const { data, isPending, isError, error, refetch } = api.admin.shop.getRegistrationsOverTime.useQuery(timeRange)

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
                { key: "shops", label: "Shops", colorVar: "--chart-1" },
            ]}
            title="Shop Registrations Over Time"
            description="Number of shop registrations over time."
            initialTimeRange={timeRange}
            onTimeRangeChange={onTimeRangeChange}
        />
    );
}