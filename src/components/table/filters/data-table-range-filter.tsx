"use client"

import { Column } from "@tanstack/react-table"

import { useState } from "react"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DataTableRangeFilterProps<TData, TValue> {
    column?: Column<TData, TValue>
    title: string
}

export function DataTableRangeFilter<TData, TValue>({
    column,
    title,
}: DataTableRangeFilterProps<TData, TValue>) {

    const [min, setMin] = useState("")
    const [max, setMax] = useState("")

    return (
        <Popover>

            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                >
                    {title}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-62.5">

                <div className="space-y-3">

                    <h4 className="font-medium">
                        {title}
                    </h4>

                    <Input
                        type="number"
                        placeholder="Min"
                        value={min}
                        onChange={(e) =>
                            setMin(e.target.value)
                        }
                    />

                    <Input
                        type="number"
                        placeholder="Max"
                        value={max}
                        onChange={(e) =>
                            setMax(e.target.value)
                        }
                    />

                    <Button
                        className="w-full"
                        onClick={() => {

                            column?.setFilterValue([
                                min
                                    ? Number(min)
                                    : undefined,

                                max
                                    ? Number(max)
                                    : undefined,
                            ])
                        }}
                    >
                        Apply
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {

                            setMin("")
                            setMax("")

                            column?.setFilterValue(
                                undefined
                            )
                        }}
                    >
                        Reset
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}