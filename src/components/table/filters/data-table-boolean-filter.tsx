"use client"

import { Column } from "@tanstack/react-table"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"

interface DataTableBooleanFilterProps<TData, TValue> {
    column?: Column<TData, TValue>
    title: string
}

export function DataTableBooleanFilter<TData, TValue>({
    column,
    title,
}: DataTableBooleanFilterProps<TData, TValue>) {

    const value = column?.getFilterValue()

    return (
        <DropdownMenu>

            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                >
                    {title}

                    {value !== undefined && (
                        <span className="ml-2 text-xs">
                            Active
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">

                <DropdownMenuLabel>
                    {title}
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() =>
                        column?.setFilterValue(true)
                    }
                >
                    True
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() =>
                        column?.setFilterValue(false)
                    }
                >
                    False
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() =>
                        column?.setFilterValue(undefined)
                    }
                >
                    All
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}