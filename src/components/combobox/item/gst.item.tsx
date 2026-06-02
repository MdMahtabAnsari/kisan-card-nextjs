import {
    Item,
    ItemContent,
    ItemDescription,
    ItemTitle,
} from "@/components/ui/item"

interface GstComboItemProps {
    state: string;
    gstNumber: string;
}

export function GstItem({ state, gstNumber }: GstComboItemProps) {
    return (
        <Item>

            <ItemContent>
                <ItemTitle>{state}</ItemTitle>
                <ItemDescription>{gstNumber}</ItemDescription>
            </ItemContent>
        </Item>
    );
}