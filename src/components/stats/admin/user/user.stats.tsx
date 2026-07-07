"use client";
import { AnalyticsCard, AnalyticsCardSkeleton } from "@/components/card/analytics.card";
import { api } from "@/trpc/react";
import { Error } from "@/components/error/error";


export function UserStats() {
    const { data: allUsers, isPending: allPendingUsers, refetch: refetchAllUsers, error: allUsersError } = api.admin.user.getMonthlyUsers.useQuery();
    const { data: activeUsers, isPending: pendingActiveUsers, refetch: refetchActiveUsers, error: activeUsersError } = api.admin.user.getMonthlyUsers.useQuery("ACTIVE");
    const { data: pendingUsers, isPending: pendingPendingUsers, refetch: refetchPendingUsers, error: pendingUsersError } = api.admin.user.getMonthlyUsers.useQuery("PENDING");
    const { data: blockedUsers, isPending: pendingBlockedUsers, refetch: refetchBlockedUsers, error: blockedUsersError } = api.admin.user.getMonthlyUsers.useQuery("BLOCKED");


    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {
                allPendingUsers ? (
                    <AnalyticsCardSkeleton />
                ) : allUsersError ? (
                    <Error title="Error loading all user stats" description={allUsersError.message} onRetry={refetchAllUsers} />
                ) : (
                    <AnalyticsCard
                        title="Total Users"
                        value={allUsers.totalCount}
                        percentage={allUsers.percentageChange}
                        trendLabel="Trend's compared to last month"
                        footerText="Total registered users"
                    />
                )
            }
            {
                pendingActiveUsers ? (
                    <AnalyticsCardSkeleton />
                ) : activeUsersError ? (
                    <Error title="Error loading active user stats" description={activeUsersError.message} onRetry={refetchActiveUsers} />
                ) : (
                    <AnalyticsCard
                        title="Active Users"
                        value={activeUsers.totalCount}
                        percentage={activeUsers.percentageChange}
                        trendLabel="Trend's compared to last month"
                        footerText="Total active users"
                    />
                )
            }
            {
                pendingPendingUsers ? (
                    <AnalyticsCardSkeleton />
                ) : pendingUsersError ? (
                    <Error title="Error loading pending user stats" description={pendingUsersError.message} onRetry={refetchPendingUsers} />
                ) : (
                    <AnalyticsCard
                        title="Pending Users"
                        value={pendingUsers.totalCount}
                        percentage={pendingUsers.percentageChange}
                        trendLabel="Trend's compared to last month"
                        footerText="Total pending users"
                    />
                )
            }
            {
                pendingBlockedUsers ? (
                    <AnalyticsCardSkeleton />
                ) : blockedUsersError ? (
                    <Error title="Error loading blocked user stats" description={blockedUsersError.message} onRetry={refetchBlockedUsers} />
                ) : (
                    <AnalyticsCard
                        title="Blocked Users"
                        value={blockedUsers.totalCount}
                        percentage={blockedUsers.percentageChange}
                        trendLabel="Trend's compared to last month"
                        footerText="Total blocked users"
                    />
                )
            }
        </div>
    );
}