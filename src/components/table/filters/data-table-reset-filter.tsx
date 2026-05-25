"use client"

import { Table } from "@tanstack/react-table"

import { X } from "lucide-react"

import { Button } from "@/components/ui/button"

interface DataTableResetFilterProps<TData> {
    table: Table<TData>
}

export function DataTableResetFilter<TData>({
    table,
}: DataTableResetFilterProps<TData>) {

    return (
        <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => {

                table.resetColumnFilters()

                table.resetGlobalFilter()
            }}
        >
            <X className="mr-2 h-4 w-4" />

            Reset
        </Button>
    )
}