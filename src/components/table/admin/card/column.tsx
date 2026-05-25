"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { formatDateTime } from "@/lib/helpers/formatter/date.formatter";

import { DataTableColumnHeader } from "@/components/table/data-table-column-header";

import { Button } from "@/components/ui/button";
import { CardRouterOutput } from "@/server/api/routers/admin/card";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StatusUpdateDialog } from "@/components/dialog/status.dialog";
import { CARD_STATUS_ACTIONS } from "@/lib/constants/status/card.status";
import { CardStatusUpdateSchema } from "@/lib/schema/common/card";



type Card =
    CardRouterOutput["getCards"]["cards"][number];

interface ColumnsProps {
    onStatusUpdate?: (status: CardStatusUpdateSchema) => void;
}



export const getColumns = ({
    onStatusUpdate,
}: ColumnsProps): ColumnDef<Card>[] => [
        // Basic Info
        {
            accessorKey: "cardNumber",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Card Number" />
            ),
        },
        {
            accessorKey: "cardHolder",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Card Holder" />
            ),
        },
        {
            accessorKey: "type",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Type" />
            ),
        },

        {
            accessorKey: "points",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Points" />
            ),
        },

        // Shop Info
        {
            accessorKey: "shopName",
            header: "Shop Name",
            cell: ({ row }) => (
                row.original.shop.name
            ),
        },
        {
            accessorKey: "ShopCode",
            header: "Shop Code",
            cell: ({ row }) => (
                row.original.shop.code
            ),
        },

        // User Info
        {
            accessorKey: "userName",
            header: "User Name",
            cell: ({ row }) => (
                row.original.user.name
            ),
        },
        {
            accessorKey: "userEmail",
            header: "User Email",
            cell: ({ row }) => (
                row.original.user.email
            ),
        },

        // Status
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                row.original.statuses.length > 0 ? row.original.statuses[0].status.name : "N/A"
            ),
        },



        // Dates
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Created At" />
            ),
            cell: ({ row }) => (
                formatDateTime(row.original.createdAt)
            ),
        },

        // Actions
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const actions = row.original.statuses.length > 0 ? CARD_STATUS_ACTIONS[row.original.statuses[0].status.name] : [];
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="w-48"
                        >
                            <DropdownMenuLabel>
                                Actions
                            </DropdownMenuLabel>

                            <DropdownMenuSeparator />

                            <DropdownMenuGroup>
                                {actions?.map((action) => (
                                    <StatusUpdateDialog
                                        key={action}
                                        status={action}
                                        trigger={
                                            <DropdownMenuItem
                                                onSelect={(e) => {
                                                    // prevents menu auto close
                                                    e.preventDefault();
                                                }}
                                            >
                                                {action}
                                            </DropdownMenuItem>
                                        }
                                        onSubmit={(values) =>
                                            onStatusUpdate?.({
                                                cardId: row.original.id,
                                                ...values,
                                            })
                                        }
                                    />
                                ))}
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

