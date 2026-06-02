import {
    Item,
    ItemContent,
    ItemDescription,
    ItemTitle,
} from "@/components/ui/item"

interface ShopComboItemProps {
    name: string;
    code:string;
    email: string;
    phone: string;
}

export function ShopItem({ name,code,email,phone }: ShopComboItemProps) {
    return (
        <Item>

            <ItemContent>
                <ItemTitle>{name}</ItemTitle>
                <ItemDescription>{code} - {email} - {phone}</ItemDescription>
            </ItemContent>
        </Item>
    );
}