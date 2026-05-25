"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

import { formatDateTime } from "@/lib/helpers/formatter/date.formatter";

import { DataTableColumnHeader } from "@/components/table/data-table-column-header";

import { Button } from "@/components/ui/button";
import {UserRouterOutput} from "@/server/api/routers/admin/user";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns: ColumnDef<UserRouterOutput['getUsers']['users'][number]>[] = [
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
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                        >
                            <span className="sr-only">
                                Open menu
                            </span>

                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                            Actions
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            asChild
                            className="cursor-pointer"
                        >
                            <Link
                                href={`/admin/users/${row.original.id}`}
                            >
                                View Details
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];