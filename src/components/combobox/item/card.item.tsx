import {
    Item,
    ItemContent,
    ItemTitle,
} from "@/components/ui/item";
import { CardType, StatusType } from "@/generated/prisma/enums";
import { formatCurrency } from "@/lib/helpers/formatter/currency.formatter";
import { formatDate } from "@/lib/helpers/formatter/date.formatter";

interface CardItemProps {
    cardNumber: string;
    cardHolder: string;
    cardType: CardType;
    points: number;
    cardExpiryDate: Date;
    status?: StatusType;
}

export function CardItem({
                             cardNumber,
                             cardHolder,
                             cardType,
                             points,
                             cardExpiryDate,
                             status,
                         }: CardItemProps) {
    return (
        <Item>
            <ItemContent className="space-y-2">
                <ItemTitle className="text-sm font-semibold">
                    {cardHolder}
                </ItemTitle>

                <dl className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between gap-2">
                        <dt className="font-medium">Card Number</dt>
                        <dd>{cardNumber}</dd>
                    </div>

                    <div className="flex justify-between gap-2">
                        <dt className="font-medium">Card Type</dt>
                        <dd>{cardType}</dd>
                    </div>

                    <div className="flex justify-between gap-2">
                        <dt className="font-medium">Points</dt>
                        <dd>{formatCurrency(points, "inr")}</dd>
                    </div>

                    <div className="flex justify-between gap-2">
                        <dt className="font-medium">Expiry</dt>
                        <dd>{formatDate(cardExpiryDate)}</dd>
                    </div>

                    <div className="flex justify-between gap-2">
                        <dt className="font-medium">Status</dt>
                        <dd>{status ?? "N/A"}</dd>
                    </div>
                </dl>
            </ItemContent>
        </Item>
    );
}