import { RechargeRouterOutput } from "@/server/api/routers/admin/recharge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Building2,
    CreditCard,
    User,
    Receipt,
    ArrowRightLeft
} from "lucide-react";
import {formatCurrency} from "@/lib/helpers/formatter/currency.formatter";
import {Skeleton} from "@/components/ui/skeleton";

interface RechargeCardProps {
    recharge: RechargeRouterOutput["getRecharge"];
}

export function RechargeCard({ recharge }: RechargeCardProps) {
    if (!recharge) {
        return null;
    }

    const { shop, rechargeBy, points, amount, card, rechargeExchangeRate } = recharge;
    const { name: shopName, code } = shop;
    const { name, role, email } = rechargeBy;

    const { amount: exchangeAmount, points: exchangePoints } = rechargeExchangeRate || {};
    const { cardNumber, cardHolder, type } = card || {};


    return (
        <Card className="w-full ">
            <CardHeader className="flex flex-row items-start justify-between pb-4">
                <div className="space-y-1.5">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        {shopName}
                    </CardTitle>
                    <CardDescription className="font-mono text-xs uppercase tracking-wider">
                        Code: {code}
                    </CardDescription>
                </div>
                <div className="flex flex-col items-end gap-2.5">
                    {/* Points Display */}
                    <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Points
        </span>

                            {Number(points).toLocaleString()}

                    </div>

                    {/* Price/Amount Display */}
                    <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Price
        </span>
                        <span className="text-sm font-bold text-foreground flex items-center gap-1.5">

                            {formatCurrency(Number(amount), "inr")}
        </span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
                {/* Exchange Rate Section */}

                    <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <ArrowRightLeft className="h-4 w-4" />
                            <span>Exchange Rate Applied</span>
                        </div>
                        <div className="font-medium">
                            {formatCurrency(Number(exchangeAmount), "inr")} = {Number(exchangePoints).toLocaleString()} Points
                        </div>
                    </div>


                <div className="flex flex-col md:flex-row gap-6">
                    {/* User Details */}
                    <div className="flex-1 space-y-4">
                        <h4 className="text-sm font-semibold flex items-center gap-2 text-primary">
                            <User className="h-4 w-4" />
                            Recharged By
                        </h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Name</span>
                                <span className="font-medium">{name}</span>
                            </div>
                            <div className="flex justify-between items-center gap-4">
                                <span className="text-muted-foreground">Email</span>
                                <span className="font-medium truncate">{email}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Role</span>
                                <Badge variant="secondary" className="capitalize text-xs">
                                    {role}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Shadcn Separator handling responsive dividers */}
                    <Separator className="hidden md:block h-auto" orientation="vertical" />
                    <Separator className="md:hidden" orientation="horizontal" />

                    {/* Payment Details */}
                    <div className="flex-1 space-y-4">
                        <h4 className="text-sm font-semibold flex items-center gap-2 text-primary">
                            <CreditCard className="h-4 w-4" />
                            Card Details
                        </h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Cardholder</span>
                                <span className="font-medium">{cardHolder}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Number</span>
                                <span className="font-mono font-medium tracking-tight">
                  {cardNumber}
                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Type</span>
                                <Badge variant="outline" className="capitalize">
                                    {type}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


export function RechargeCardSkeleton() {
    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-start justify-between pb-4">
                <div className="space-y-2">
                    {/* Shop Name & Icon Skeleton */}
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded-md" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                    {/* Code Skeleton */}
                    <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex flex-col items-end gap-2 mt-1">
                    {/* Points Badge Skeleton */}
                    <Skeleton className="h-6 w-24 rounded-full" />
                    {/* Amount & Icon Skeleton */}
                    <div className="flex items-center gap-1.5">
                        <Skeleton className="h-4 w-4 rounded-md" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
                {/* Exchange Rate Section Skeleton */}
                <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-md" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-4 w-28" />
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* User Details Skeleton */}
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded-md" />
                            <Skeleton className="h-5 w-28" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <div className="flex justify-between items-center gap-4">
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-4 w-36" />
                            </div>
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-4 w-10" />
                                <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                        </div>
                    </div>

                    {/* Separators */}
                    <Separator className="hidden md:block h-auto" orientation="vertical" />
                    <Separator className="md:hidden" orientation="horizontal" />

                    {/* Payment Details Skeleton */}
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded-md" />
                            <Skeleton className="h-5 w-32" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-28" />
                            </div>
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-4 w-10" />
                                <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}