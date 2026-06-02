"use client"

import { Column } from "@tanstack/react-table"

import { ListFilter } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Option {
    label: string
    value: string
}

interface DataTableFacetedFilterProps<TData, TValue> {
    column?: Column<TData, TValue>
    title: string
    options: Option[]
}

export function DataTableFacetedFilter<TData, TValue>({
    column,
    title,
    options,
}: DataTableFacetedFilterProps<TData, TValue>) {

    const selectedValues =
        (column?.getFilterValue() as string[]) ?? []


    return (
        <DropdownMenu>

            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                >
                    <ListFilter className="mr-2 h-4 w-4" />

                    {title}

                    {selectedValues.length > 0 && (
                        <span className="ml-2 rounded bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                            {selectedValues.length}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                className="w-55"
            >

                <DropdownMenuLabel>
                    {title}
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {options.map((option) => {

                    const isSelected =
                        selectedValues.includes(option.value)

                    return (
                        <DropdownMenuCheckboxItem
                            key={option.value}
                            checked={isSelected}
                            onCheckedChange={(checked) => {

                                let values = [...selectedValues]

                                if (checked) {
                                    values.push(option.value)
                                } else {
                                    values = values.filter(
                                        (value) =>
                                            value !== option.value
                                    )
                                }

                                column?.setFilterValue(
                                    values.length
                                        ? values
                                        : undefined
                                )
                            }}
                        >
                            {option.label}
                        </DropdownMenuCheckboxItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}