"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { formatDateTime } from "@/lib/helpers/formatter/date.formatter";

import { DataTableColumnHeader } from "@/components/table/data-table-column-header";

import { Button } from "@/components/ui/button";
import {UserRouterOutput} from "@/server/api/routers/admin/user";
import {USER_STATUS_ACTIONS} from "@/lib/constants/status/user.status";
import { UserStatusUpdateSchema } from "@/lib/schema/common/user";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusUpdateDialog } from "@/components/dialog/status.dialog";

type User = UserRouterOutput['getUsers']['users'][number]

interface ColumnsProps {
    onStatusUpdate?: (status: UserStatusUpdateSchema) => void;
}


export const getColumns = ({
    onStatusUpdate,
}: ColumnsProps): ColumnDef<User>[] => [
    // Basic Info
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
    },
    {
        accessorKey: "role",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Role" />
        ),
    },

    // Verification
    {
        accessorKey: "emailVerified",
        header: "Email Verified",
        cell: ({ row }) => (
            row.original.emailVerified ? "Yes" : "No"
        ),
    },
    {
        accessorKey: "phoneNumberVerified",
        header: "Phone Verified",
        cell: ({ row }) => (
            row.original.phoneNumberVerified ? "Yes" : "No"
        ),
    },

    // Contact
    {
        accessorKey: "phoneNumber",
        header: "Phone Number",
        cell: ({ row }) => (
            row.original.phoneNumber || "N/A"
        ),
    },

    // Identity
    {
        accessorKey: "aadhaarNumber",
        header: "Aadhaar Number",
        cell: ({ row }) => (
            row.original.aadhaarNumber || "N/A"
        ),
    },
    {
        accessorKey: "username",
        header: "Username",
        cell: ({ row }) => (
            row.original.username || "N/A"
        ),
    },
    {
        accessorKey: "displayUsername",
        header: "Display Username",
        cell: ({ row }) => (
            row.original.displayUsername || "N/A"
        ),
    },

    // Ban Status
    {
        accessorKey: "banned",
        header: "Banned",
        cell: ({ row }) => (
            row.original.banned ? "Yes" : "No"
        ),
    },
    {
        accessorKey: "banReason",
        header: "Ban Reason",
        cell: ({ row }) => (
            row.original.banReason || "N/A"
        ),
    },

    {
        accessorKey: "userStatuses",
        header: "Status",
        cell: ({ row }) => (
            row.original.userStatuses?.[0]?.status?.name || "N/A"
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
                const actions = row.original.userStatuses.length > 0 ? USER_STATUS_ACTIONS[row.original.userStatuses[0].status.name] : [];
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
                                                userId: row.original.id,
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