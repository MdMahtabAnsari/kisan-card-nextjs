"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    VisibilityState,
    getFilteredRowModel,
    ColumnFiltersState,
} from "@tanstack/react-table"
import { PaginationSchema } from "@/lib/schema/common/page"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Settings2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableResetFilter } from "@/components/table/filters/data-table-reset-filter";
import { DataTableFacetedFilter } from "@/components/table/filters/data-table-faceted-filter";
import {DataTableBooleanFilter} from "@/components/table/filters/data-table-boolean-filter";
import { UserRole,CardType,StatusType } from "@/generated/prisma/browser";

interface DataTableProps<TData, TValue, TPagination extends PaginationSchema = PaginationSchema> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    pagination: TPagination
    onPaginationChange: (pagination: { page: number, limit: number }) => void
    sorting?: SortingState
    onSortingChange?: (sorting: SortingState) => void
    globalFilter?: string
    onGlobalFilterChange?: (value: string) => void
    isLoading: boolean,
    columnFilters?: ColumnFiltersState
    onColumnFiltersChange?: (filters: ColumnFiltersState) => void
}

export function DataTable<TData, TValue, TPagination extends PaginationSchema = PaginationSchema>({
    columns,
    data,
    pagination,
    onPaginationChange,
    sorting,
    onSortingChange,
    globalFilter,
    onGlobalFilterChange,
    isLoading,
    columnFilters,
    onColumnFiltersChange,
}: DataTableProps<TData, TValue, TPagination>) {
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        state: {
            pagination: {
                pageIndex: Math.max(0, pagination.currentPage - 1),
                pageSize: pagination.limit,
            },
            sorting,
            globalFilter,
            columnVisibility,
            columnFilters,
        },
        pageCount: pagination.totalPages,
        onColumnVisibilityChange: setColumnVisibility,
        onSortingChange: (updater) => {
            if (!sorting) return
            const next = typeof updater === 'function' ? updater(sorting) : updater
            onSortingChange?.(next)
        },
        onPaginationChange: (updater) => {
            const state = typeof updater === 'function'
                ? updater({
                    pageIndex: Math.max(0, pagination.currentPage - 1),
                    pageSize: pagination.limit,
                })
                : updater
            onPaginationChange({ page: state.pageIndex + 1, limit: state.pageSize })
        },
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: (updater) => {
            if (!columnFilters) return

            const next =
                typeof updater === "function"
                    ? updater(columnFilters)
                    : updater

            onColumnFiltersChange?.(next)
        },
    })

    const roleColumn = table.getAllColumns().find(c => c.id === "role") ?? null;
    const  emailVerifiedColumn = table.getAllColumns().find(c => c.id === "emailVerified") ?? null;
    const phoneNumberVerifiedColumn = table.getAllColumns().find(c => c.id === "phoneNumberVerified") ?? null;
    const bannedColumn = table.getAllColumns().find(c => c.id === "banned") ?? null;
    const statusColumn = table.getAllColumns().find(c => c.id === "status") ?? null;
    const typeColumn = table.getAllColumns().find(c => c.id === "type") ?? null;
    const UserStatusColumn = table.getAllColumns().find(c => c.id === "userStatuses") ?? null;

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4 py-4">

                {/* Left Side Controls */}
                <div className="flex flex-wrap items-center gap-2">

                    {onGlobalFilterChange && (
                        <Input
                            placeholder="Search all..."
                            value={globalFilter ?? ""}
                            onChange={(e) => onGlobalFilterChange(e.target.value)}
                            className="w-62.5"
                        />
                    )}

                    {columnFilters && (
                        <>
                            

                            {roleColumn && (
                                <DataTableFacetedFilter
                                    column={roleColumn}
                                    title="Role"
                                    options={[
                                        ...Object.values(UserRole).map((role) => ({
                
                                            label: role.replace(/_/g, ' '),
                                            value: role
                                        }))
                                    ]}
                                />
                            )}

                            {
                                emailVerifiedColumn && (
                                    <DataTableBooleanFilter
                                        column={emailVerifiedColumn}
                                        title="Email Verified"
                                    />
                                )
                            }
                            {
                                phoneNumberVerifiedColumn && (
                                    <DataTableBooleanFilter
                                        column={phoneNumberVerifiedColumn}
                                        title="Phone Number Verified"
                                    />
                                )
                            }
                            {
                                bannedColumn && (
                                    <DataTableBooleanFilter
                                        column={bannedColumn}
                                        title="Banned"
                                    />
                                )
                            }
                            {statusColumn && (
                                <DataTableFacetedFilter
                                    column={statusColumn}
                                    title="Status"
                                    options={[
                                        ...Object.values(StatusType).map((status) => ({
                                            label: status.replace(/_/g, ' '),
                                            value: status
                                        }))
                                    ]}
                                />
                            )}
                            {typeColumn && (
                                <DataTableFacetedFilter
                                    column={typeColumn}
                                    title="Type"
                                    options={[
                                        ...Object.values(CardType).map((type) => ({
                                            label: type.replace(/_/g, ' '),
                                            value: type
                                        }))
                                    ]}
                                />

                            )}
                            {
                                UserStatusColumn && (
                                    <DataTableFacetedFilter
                                        column={UserStatusColumn}
                                        title="Status"
                                       options={[
                                        ...Object.values(StatusType).map((status) => ({
                                            label: status.replace(/_/g, ' '),
                                            value: status
                                        }))
                                    ]}
                                    />
                                )
                            }
                            
                            <DataTableResetFilter table={table} />
                        </>
                    )}
                </div>

                {/* Right Side */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="cursor-pointer">
                            <Settings2 className="mr-2 h-4 w-4" />
                            Columns
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) =>
                                        column.toggleVisibility(!!value)
                                    }
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: pagination.limit }).map((_, r) => (
                                <TableRow key={`skeleton-row-${r}`}>
                                    {table.getVisibleLeafColumns().map((col) => (
                                        <TableCell key={`skeleton-cell-${r}-${col.id}`}>
                                            <Skeleton className="h-6 w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={table.getVisibleLeafColumns().length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    className="cursor-pointer"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <ChevronLeft />
                    Previous
                </Button>
                <Button
                    variant="outline"
                    className="cursor-pointer"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                    <ChevronRight />
                </Button>
            </div>
        </div>

    )
}