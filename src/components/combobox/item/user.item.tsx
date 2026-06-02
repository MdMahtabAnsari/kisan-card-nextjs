import { UserRole } from "@/generated/prisma/browser";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

interface UserComboItemProps {
    name: string;
    username?: string;
    email: string;
    role: UserRole;
    image?: string;
}

export function UserItem({ name, username, email, role, image }: UserComboItemProps) {
    return (
        <Item>
            <ItemMedia>
                <Avatar>
                    <AvatarImage src={image} alt={name} />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
            </ItemMedia>
            <ItemContent>
                <ItemTitle>{name} {username ? `(@${username})` : ""}</ItemTitle>
                <ItemDescription>{email} - {role}</ItemDescription>
            </ItemContent>
        </Item>
    );
}