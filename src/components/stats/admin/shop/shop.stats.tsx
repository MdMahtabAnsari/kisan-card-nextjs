"use client";
import { AnalyticsCard, AnalyticsCardSkeleton } from "@/components/card/analytics.card";
import { api } from "@/trpc/react";
import { Error } from "@/components/error/error";


export function ShopStats() {
    const { data: allShops, isPending: allPendingShops, refetch: refetchAllShops, error: allShopsError } = api.admin.shop.getMonthlyShops.useQuery();
    const { data: activeShops, isPending: pendingActiveShops, refetch: refetchActiveShops, error: activeShopsError } = api.admin.shop.getMonthlyShops.useQuery("ACTIVE");
    const { data: pendingShops, isPending: pendingPendingShops, refetch: refetchPendingShops, error: pendingShopsError } = api.admin.shop.getMonthlyShops.useQuery("PENDING");
    const { data: blockedShops, isPending: pendingBlockedShops, refetch: refetchBlockedShops, error: blockedShopsError } = api.admin.shop.getMonthlyShops.useQuery("BLOCKED");


    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {
                allPendingShops ? (
                    <AnalyticsCardSkeleton />
                ) : allShopsError ? (
                    <Error title="Error loading all shop stats" description={allShopsError.message} onRetry={refetchAllShops} />
                ) : (
                    <AnalyticsCard
                        title="Total Shops"
                        value={allShops.totalCount}
                        percentage={allShops.percentageChange}
                        trendLabel="Trend's compared to last month"
                        footerText="Total registered shops"
                    />
                )
            }
            {
                pendingActiveShops ? (
                    <AnalyticsCardSkeleton />
                ) : activeShopsError ? (
                    <Error title="Error loading active shop stats" description={activeShopsError.message} onRetry={refetchActiveShops} />
                ) : (
                    <AnalyticsCard
                        title="Active Shops"
                        value={activeShops.totalCount}
                        percentage={activeShops.percentageChange}
                        trendLabel="Trend's compared to last month"
                        footerText="Total active shops"
                    />
                )
            }
            {
                pendingPendingShops ? (
                    <AnalyticsCardSkeleton />
                ) : pendingShopsError ? (
                    <Error title="Error loading pending shop stats" description={pendingShopsError.message} onRetry={refetchPendingShops} />
                ) : (
                    <AnalyticsCard
                        title="Pending Shops"
                        value={pendingShops.totalCount}
                        percentage={pendingShops.percentageChange}
                        trendLabel="Trend's compared to last month"
                        footerText="Total pending shops"
                    />
                )
            }
            {
                pendingBlockedShops ? (
                    <AnalyticsCardSkeleton />
                ) : blockedShopsError ? (
                    <Error title="Error loading blocked card stats" description={blockedShopsError.message} onRetry={refetchBlockedShops} />
                ) : (
                    <AnalyticsCard
                        title="Blocked Shops"
                        value={blockedShops.totalCount}
                        percentage={blockedShops.percentageChange}
                        trendLabel="Trend's compared to last month"
                        footerText="Total blocked shops"
                    />
                )
            }
        </div>
    );
}