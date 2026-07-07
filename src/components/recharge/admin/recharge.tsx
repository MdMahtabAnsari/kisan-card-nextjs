"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { cardByIdOrNumberSchema } from "@/lib/schema/admin/card";

// Your custom components
import { CardCombobox } from "@/components/combobox/admin/card.combobox";
import { CardDetailCard, CardDetailCardSkeleton } from "@/components/card/card-detail.card";

// shadcn/ui components
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function Recharge() {
    const [card, setCard] = useState<string>("");

    const { data, isFetching } = api.admin.card.getCard.useQuery(card, {
        enabled: cardByIdOrNumberSchema.safeParse(card).success,
    });

    return (
        <div className="w-full">
            <Card className="w-full shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Recharge Card
                    </CardTitle>
                    <CardDescription>
                        Search by card ID or number to view details and initialize a recharge.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Search/Input Section */}
                    <div className="flex flex-col space-y-3">
                        <label
                            htmlFor="card-search"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Select Card
                        </label>
                        <div className="w-full sm:max-w-md">
                            <CardCombobox value={card} onChange={setCard} />
                        </div>
                    </div>

                    {/* Conditional Divider */}
                    {card && <Separator className="my-4" />}

                    {/* Results Section */}
                    <div className="w-full min-h-[200px] flex flex-col justify-center">
                        {isFetching ? (
                            <CardDetailCardSkeleton />
                        ) : data ? (
                            <CardDetailCard card={data} />
                        ) : card ? (
                            <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg bg-muted/20">
                                <p className="text-sm text-muted-foreground">
                                    No card details found for this selection.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg bg-muted/20">
                                <p className="text-sm text-muted-foreground">
                                    Please select a card to view its details.
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}