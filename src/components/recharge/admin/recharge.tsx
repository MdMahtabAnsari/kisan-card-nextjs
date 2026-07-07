"use client";

import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import { cardByIdOrNumberSchema } from "@/lib/schema/admin/card";
import { CreateRechargeSchema } from "@/lib/schema/common/recharge";

// Your custom components
import { CardCombobox } from "@/components/combobox/admin/card.combobox";
import { CardDetailCard, CardDetailCardSkeleton } from "@/components/card/card-detail.card";
import { AmountInput } from "@/components/recharge/amount-input";
import { Exchange } from "@/components/recharge/exchange";
import { useDebounceCallback } from 'usehooks-ts';
import { toast } from 'sonner';
import { IndianRupee, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// shadcn/ui components
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export function Recharge() {
    const [card, setCard] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [debouncedAmount, setDebouncedAmount] = useState<string>("");
    const router = useRouter();

    const debounced = useDebounceCallback(setDebouncedAmount, 500);

    useEffect(() => {
        debounced(amount);
    }, [amount, debounced]);

    const { data, isFetching } = api.admin.card.getCard.useQuery(card, {
        enabled: cardByIdOrNumberSchema.safeParse(card).success,
    });

    const rechargeMutation = api.admin.recharge.recharge.useMutation({
        onSuccess: (data) => {
            router.push(`/admin/recharge/${data.id}/payment`);
        }
    });

    const onRecharge = (rechargeData: CreateRechargeSchema) => {
        toast.promise(rechargeMutation.mutateAsync(rechargeData), {
            loading: "Processing recharge...",
            success: "Recharge initiated successfully!",
            error: (error) => `${error.message}`
        });
    };

    return (
        <div className="w-full">
            <Card className="w-full">
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
                            <div className="space-y-6 animate-in fade-in duration-300">
                                {/* Card Details */}
                                <CardDetailCard card={data} />

                                {/* Recharge Controls */}
                                <div className="space-y-4 p-4 border bg-card">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-medium tracking-tight">
                                            Recharge Details
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Enter the amount to process the exchange and recharge the card.
                                        </p>
                                    </div>

                                    <div className="flex flex-col w-full h-fit gap-4">
                                        <AmountInput
                                            value={amount}
                                            onChange={setAmount}
                                        />

                                        <Exchange
                                            amount={Number(debouncedAmount)}
                                            type={data.type}
                                            points={Number(data.points)}
                                        />

                                        <div className="pt-2 flex justify-end">
                                            <Button
                                                onClick={() => onRecharge({
                                                    identifier: data.id,
                                                    amount: amount
                                                } )} // Adjust these keys based on your exact schema
                                                disabled={!amount || Number(amount) <= 0 || rechargeMutation.isPending}
                                                className="w-full sm:w-auto"
                                            >
                                                {rechargeMutation.isPending ? (
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                ) : (
                                                    <IndianRupee className="w-4 h-4 mr-2" />
                                                )}
                                                {rechargeMutation.isPending ? "Processing..." : "Recharge"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
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