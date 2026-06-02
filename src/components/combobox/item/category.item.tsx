import {
    Item,
    ItemContent,
    ItemTitle,
} from "@/components/ui/item"

interface CategoryComboItemProps {
    name: string;
}

export function CategoryItem({ name }: CategoryComboItemProps) {
    return (
        <Item>

            <ItemContent>
                <ItemTitle>{name}</ItemTitle>

            </ItemContent>
        </Item>
    );
}