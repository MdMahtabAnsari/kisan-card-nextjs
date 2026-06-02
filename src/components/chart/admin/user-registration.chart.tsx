"use client"
import { GenericAreaChart, GenericAreaChartSkeleton } from "@/components/chart/area.chart";
import { useState } from "react";
import { api } from "@/trpc/react";
import { DayEnum } from "@/lib/schema/common/day";
import { Error } from "@/components/error/error";


export function UserRegistrationChart() {
    const [timeRange, setTimeRange] = useState<DayEnum>("30");

    const { data, isPending, isError, error, refetch } = api.admin.user.getRegistrationsOverTime.useQuery(timeRange)

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
                { key: "users", label: "Users", colorVar: "--chart-1" },
                { key: "shopManagers", label: "Shop Managers", colorVar: "--chart-2" },
                { key: "warehouseManagers", label: "Warehouse Managers", colorVar: "--chart-3" },
                { key: "admins", label: "Admins", colorVar: "--chart-4" },
            ]}
            title="User Registrations Over Time"
            description="Number of user registrations over time."
            initialTimeRange={timeRange}
            onTimeRangeChange={onTimeRangeChange}
        />
    );
}