"use client";
import { AnalyticsCard, AnalyticsCardSkeleton } from "@/components/card/analytics.card";
import { api } from "@/trpc/react";
import { Error } from "@/components/error/error";
import { formatCurrency } from "@/lib/helpers/formatter/currency.formatter";

export function DashboardStats() {
    const { data: cards, isPending: pendingCards, refetch: refetchCards, error: cardsError } = api.admin.card.getMonthlyCards.useQuery("ACTIVE");
    const { data: revenue, isPending: pendingRevenue, isError: isErrorRevenue, refetch: refetchRevenue, error: revenueError } = api.admin.revenue.getMonthlyRevenue.useQuery();
    const { data: shops, isPending: pendingShops, isError: isErrorShops, refetch: refetchShops, error: shopsError } = api.admin.shop.getMonthlyRegistrations.useQuery();
    const { data: users, isPending: pendingUsers, isError: isErrorUsers, refetch: refetchUsers, error: usersError } = api.admin.user.getMonthlyRegistrations.useQuery();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {
                pendingUsers ? (
                    <AnalyticsCardSkeleton />
                ) : isErrorUsers ? (
                    <Error title="Error loading user stats" description={usersError.message} onRetry={refetchUsers} />
                ) : (
                    <AnalyticsCard
                        title="Total Users"
                        value={users.totalCount}
                        percentage={users.percentageChange}
                        trendLabel="Trend's compared to last month"
                        footerText="Total registered users"
                    />
                )
            }
            {
                pendingShops ? (
                    <AnalyticsCardSkeleton />
                ) : isErrorShops ? (
                    <Error title="Error loading shop stats" description={shopsError.message} onRetry={refetchShops} />
                ) : (
                    <AnalyticsCard
                        title="Total Shops"
                        value={shops.totalCount}
                        percentage={shops.percentageChange}
                        trendLabel="Trend's compared to last month"
                        footerText="Total registered shops"
                    />
                )
            }
            {
                pendingCards ? (
                    <AnalyticsCardSkeleton />
                ) : cardsError ? (
                    <Error title="Error loading card stats" description={cardsError.message} onRetry={refetchCards} />
                ) : (
                    <AnalyticsCard
                        title="Active Cards"
                        value={cards.totalCount}
                        percentage={cards.percentageChange}
                        trendLabel="Trend's compared to last month"
                        footerText="Total active cards"
                    />
                )
            }
            {
                pendingRevenue ? (
                    <AnalyticsCardSkeleton />
                ) : isErrorRevenue ? (
                    <Error title="Error loading revenue stats" description={revenueError.message} onRetry={refetchRevenue} />
                ) : (
                    <AnalyticsCard
                        title="Monthly Revenue"
                        value={formatCurrency(revenue.totalRevenue,"INR")}
                        percentage={revenue.percentageChange}
                        trendLabel="Trend's compared to last month"
                        footerText="Total revenue generated this month"
                    />
                )   
            }
        </div>
    );
}