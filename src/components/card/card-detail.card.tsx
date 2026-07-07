import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CardRouterOutput } from "@/server/api/routers/admin/card";
import { formatCurrency } from "@/lib/helpers/formatter/currency.formatter";
import { formatDate } from "@/lib/helpers/formatter/date.formatter";
import { CreditCard, Calendar, Star, Store, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"

interface CardDetailCardProps {
    card: CardRouterOutput["getCard"]
}

export function CardDetailCard({ card }: CardDetailCardProps) {
    if (!card) {
        return null;
    }

    const { cardNumber, cardHolder, expiryDate, points, shop, statuses, type } = card
    const { code, name } = shop
    const status = statuses.find(status => status.isCurrent)?.status.name || "Unknown"

    return (
        <Card className="w-full">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            {cardHolder}
                        </CardTitle>
                        <CardDescription className="text-sm font-mono text-muted-foreground flex items-center gap-2 mt-2">
                            <CreditCard className="h-4 w-4" />
                            {cardNumber}
                        </CardDescription>
                    </div>

                    {/* Badges Container */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Badge className="tracking-wide">
                            {status}
                        </Badge>
                        {type && (
                            <Badge variant="secondary" className="tracking-wide capitalize">
                                {/* Note: If 'type' is an object, change this to type.name */}
                                {type}
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-5">
                {/* Metric Boxes Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Points Box */}
                    <div className="flex flex-col space-y-1 p-3 bg-primary/5 border border-primary/10">
                        <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                            <Star className="h-3.5 w-3.5 text-primary" />
                            Points Balance
                        </span>
                        <span className="text-lg font-bold text-primary">
                            {formatCurrency(Number(points), "inr")}
                        </span>
                    </div>

                    {/* Expiry Box */}
                    <div className="flex flex-col space-y-1 p-3  bg-muted/40 border border-border/50">
                        <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                            <Calendar className="h-3.5 w-3.5" />
                            Valid Thru
                        </span>
                        <span className="text-lg font-semibold tracking-tight">
                            {formatDate(expiryDate)}
                        </span>
                    </div>
                </div>

                <Separator />

                {/* Shop Information */}
                <div className="flex items-center gap-3 p-2  hover:bg-muted/40 transition-colors">
                    <div className="p-2.5 bg-secondary  flex-shrink-0">
                        <Store className="h-4 w-4 text-secondary-foreground" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">{name}</span>
                        <span className="text-xs text-muted-foreground">Store Code: {code}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export function CardDetailCardSkeleton() {
    return (
        <Card className="w-full">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 w-full mt-1">
                        {/* Title Skeleton (User icon + Name) */}
                        <Skeleton className="h-6 w-3/5" />
                        {/* Description Skeleton (CreditCard icon + Card Number) */}
                        <Skeleton className="h-4 w-4/5" />
                    </div>

                    {/* Badges Container Skeleton */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        {/* Status Badge Skeleton */}
                        <Skeleton className="h-5 w-16 " />
                        {/* Type Badge Skeleton */}
                        <Skeleton className="h-5 w-14 " />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-5">
                {/* Metric Boxes Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Points Box Skeleton */}
                    <div className="flex flex-col space-y-2 p-3  border border-border/50">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-6 w-20" />
                    </div>

                    {/* Expiry Box Skeleton */}
                    <div className="flex flex-col space-y-2 p-3  border border-border/50">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-6 w-24" />
                    </div>
                </div>

                <Separator />

                {/* Shop Information Skeleton */}
                <div className="flex items-center gap-3 p-2">
                    {/* Icon Skeleton */}
                    <Skeleton className="h-9 w-9  flex-shrink-0" />
                    <div className="flex flex-col space-y-2 w-full py-1">
                        {/* Shop Name Skeleton */}
                        <Skeleton className="h-4 w-32" />
                        {/* Store Code Skeleton */}
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}