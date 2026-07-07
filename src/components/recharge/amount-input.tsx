"use client";

import {  IndianRupee } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";

interface AmountInputProps {
    value: string;
    onChange: (value: string) => void;
}

const quickAmounts = [
    50,
    100,
    200,
    500,
    1000,
    2000,
    4000,
    5000,
];

export function AmountInput({
                                value,
                                onChange,
                            }: AmountInputProps) {
    return (
        <Card className="w-full">
            <CardContent className="space-y-5 p-5">
                <div className="space-y-2">
                    <h3 className="text-base font-semibold">
                        Recharge Amount
                    </h3>

                    <p className="text-muted-foreground text-sm">
                        Enter an amount or choose one below.
                    </p>
                </div>

                <InputGroup className="h-12">
                    <InputGroupAddon>
                        <IndianRupee />
                    </InputGroupAddon>

                    <InputGroupInput

                        placeholder="Enter amount"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="text-lg font-semibold"
                    />

                </InputGroup>

                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                        Quick Select
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {quickAmounts.map((amount) => {
                            const active = value === amount.toString();

                            return (
                                <Badge
                                    key={amount}
                                    variant={active ? "default" : "secondary"}
                                    className="cursor-pointer rounded-full px-4 py-2 text-sm transition-all hover:scale-105"
                                    onClick={() => onChange(amount.toString())}
                                >
                                    ₹{amount}
                                </Badge>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}