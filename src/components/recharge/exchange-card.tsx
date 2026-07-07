"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExchangeRouterOutput } from "@/server/api/routers/common/exchnage";
import {formatCurrency} from "@/lib/helpers/formatter/currency.formatter";
import {Skeleton} from "@/components/ui/skeleton";


interface ExchangeCardProps {
    exchange: ExchangeRouterOutput["getExchange"];
    currentPoints: number;
    amount: number;
}

export function ExchangeCard({
                                 exchange,
                                 currentPoints,
                                 amount,
                             }: ExchangeCardProps) {
    if (!exchange) return null;

    const {
        points,
        amount: exchangeAmount,
        cardType,
    } = exchange;

    const earnedPoints =
        (Number(points) * amount) / Number(exchangeAmount);

    const totalPoints = currentPoints + earnedPoints;

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    Exchange Details
                    <Badge variant="secondary">{cardType}</Badge>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                    <span>Recharge Amount</span>
                    <span className="font-medium">₹{amount}</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span>Exchange Rate</span>
                    <span className="font-medium">
            {formatCurrency(Number(exchangeAmount),"inr")} = {Number(points).toLocaleString()} Points
          </span>
                </div>

                <div className="flex justify-between text-sm">
                    <span>Current Points</span>
                    <span className="font-medium">
            {Number(currentPoints).toLocaleString()}
          </span>
                </div>

                <div className="flex justify-between text-sm">
                    <span>Points Earned</span>
                    <span className="font-medium text-green-600">
            {Number(earnedPoints).toLocaleString()}
          </span>
                </div>

                <Separator />

                <div className="flex justify-between text-base font-semibold">
                    <span>Total Points</span>
                    <span>{Number(totalPoints).toLocaleString()}</span>
                </div>
            </CardContent>
        </Card>
    );
}


export function ExchangeCardSkeleton() {
    return (
        <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-6 w-20 rounded-full" />
            </CardHeader>

            <CardContent className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between"
                    >
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                ))}

                <Skeleton className="h-px w-full" />

                <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-5 w-24" />
                </div>
            </CardContent>
        </Card>
    );
}



