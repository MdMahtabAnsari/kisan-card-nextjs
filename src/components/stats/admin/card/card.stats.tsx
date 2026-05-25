"use client";
import { AnalyticsCard, AnalyticsCardSkeleton } from "@/components/card/analytics.card";
import { api } from "@/trpc/react";
import { Error } from "@/components/error/error";


export function CardStats() {
    const { data: allCards, isPending: allPendingCards, refetch: refetchAllCards, error: allCardsError } = api.admin.card.getMonthlyCards.useQuery();
    const { data: activeCards, isPending: pendingActiveCards, refetch: refetchActiveCards, error: activeCardsError } = api.admin.card.getMonthlyCards.useQuery("ACTIVE");
    const { data: pendingCards, isPending: pendingPendingCards, refetch: refetchPendingCards, error: pendingCardsError } = api.admin.card.getMonthlyCards.useQuery("PENDING");
    const { data: blockedCards, isPending: pendingBlockedCards, refetch: refetchBlockedCards, error: blockedCardsError } = api.admin.card.getMonthlyCards.useQuery("BLOCKED");
   

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {
                allPendingCards ? (
                    <AnalyticsCardSkeleton />
                ) : allCardsError ? (
                    <Error title="Error loading all card stats" description={allCardsError.message} onRetry={refetchAllCards} />
                ) : (
                    <AnalyticsCard
                        title="Total Cards"
                        value={allCards.totalCount}
                        percentage={allCards.percentageChange}
                        trendLabel="Trend's compared to last month"
                        footerText="Total registered cards"
                    />
                )
            }
            {
                pendingActiveCards ? (
                    <AnalyticsCardSkeleton />
                ) : activeCardsError ? (
                    <Error title="Error loading active card stats" description={activeCardsError.message} onRetry={refetchActiveCards} />
                ) : (
                    <AnalyticsCard
                        title="Active Cards"
                        value={activeCards.totalCount}
                        percentage={activeCards.percentageChange}
                        trendLabel="Trend's compared to last month"
                        footerText="Total active cards"
                    />
                )
            }
            {
                pendingPendingCards ? (
                    <AnalyticsCardSkeleton />
                ) : pendingCardsError ? (
                    <Error title="Error loading pending card stats" description={pendingCardsError.message} onRetry={refetchPendingCards} />
                ) : (
                    <AnalyticsCard
                        title="Pending Cards"
                        value={pendingCards.totalCount}
                        percentage={pendingCards.percentageChange}
                        trendLabel="Trend's compared to last month"
                        footerText="Total pending cards"
                    />
                )
            }
            {
                pendingBlockedCards ? (
                    <AnalyticsCardSkeleton />
                ) : blockedCardsError ? (
                    <Error title="Error loading blocked card stats" description={blockedCardsError.message} onRetry={refetchBlockedCards} />
                ) : (
                    <AnalyticsCard
                        title="Blocked Cards"
                        value={blockedCards.totalCount}
                        percentage={blockedCards.percentageChange}
                        trendLabel="Trend's compared to last month"
                        footerText="Total blocked cards"
                    />
                )   
            }
        </div>
    );
}