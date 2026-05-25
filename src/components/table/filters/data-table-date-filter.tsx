"use client"

import { Column } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableDateFilterProps<TData, TValue> {
    column?: Column<TData, TValue>
    title: string
}

export function DataTableDateFilter<TData, TValue>({
    column,
    title,
}: DataTableDateFilterProps<TData, TValue>) {

    return (
        <DropdownMenu>

            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                >
                    {title}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">

                <DropdownMenuItem
                    onClick={() => {

                        const today = new Date()

                        column?.setFilterValue({
                            from: today,
                            to: today,
                        })
                    }}
                >
                    Today
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => {

                        const from = new Date()

                        from.setDate(
                            from.getDate() - 7
                        )

                        column?.setFilterValue({
                            from,
                            to: new Date(),
                        })
                    }}
                >
                    Last 7 Days
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => {

                        const from = new Date()

                        from.setMonth(
                            from.getMonth() - 1
                        )

                        column?.setFilterValue({
                            from,
                            to: new Date(),
                        })
                    }}
                >
                    Last Month
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() =>
                        column?.setFilterValue(
                            undefined
                        )
                    }
                >
                    Reset
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}