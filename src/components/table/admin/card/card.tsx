"use client";
import { getColumns } from "@/components/table/admin/card/column";
import { api } from "@/trpc/react";
import { DataTable } from "@/components/table/data.table";
import { useState } from "react";
import { Error } from "@/components/error/error";
import type { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { useCallback, useEffect } from "react";
import { useDebounceCallback } from 'usehooks-ts'
import { filterCardSchema } from "@/lib/schema/admin/card";
import { SortOrder } from "@/lib/types/sort";
import { CardType, StatusType } from "@/generated/prisma/browser";
import { CardStatusUpdateSchema } from "@/lib/schema/common/card";
import {toast} from 'sonner';

export function CardTable() {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [cardHolder, setCardHolder] = useState<SortOrder | undefined>(undefined);
    const [cardNumber, setCardNumber] = useState<SortOrder | undefined>(undefined);
    const [createdAt, setCreatedAt] = useState<SortOrder | undefined>(undefined);
    const [type, setType] = useState<SortOrder | undefined>(undefined);
    const [sorting, setSorting] = useState<SortingState>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)
    const debounceSearch = useDebounceCallback(setDebouncedSearchTerm, 300)
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [statuses, setStatuses] = useState<StatusType[] | undefined>(undefined);
    const [types, setTypes] = useState<CardType[] | undefined>(undefined);
    const [points, setPoints] = useState<SortOrder | undefined>(undefined);


    const statusUpdateMutation = api.admin.card.updateCardStatus.useMutation({
        onSuccess: () => {
            refetch();
        }
    })

    const onStatusUpdate = useCallback((values: CardStatusUpdateSchema) => {

        toast.promise(
            statusUpdateMutation.mutateAsync(values),
            {
                loading: 'Updating card status...',
                success: 'Card status updated successfully!',
                error: (err) => `Failed to update card status: ${err.message}`,
            }
        );
        
    }, [statusUpdateMutation])

    const columns = getColumns({ onStatusUpdate });



    const { data, isPending, error, isError, refetch } = api.admin.card.getCards.useQuery(
        {
            pageLimit: { page, limit },
            type: types,
            status: statuses,
            search: debouncedSearchTerm.trim() === '' ? undefined : debouncedSearchTerm,
            createdAt,
            cardNumber,
            cardHolder,
            typeSort: type,
            points



        },
        {
            enabled: filterCardSchema.safeParse({
                pageLimit: { page, limit },
                type: types,
                status: statuses,
                search: debouncedSearchTerm.trim() === '' ? undefined : debouncedSearchTerm,
                createdAt,
                cardNumber,
                cardHolder,
                typeSort: type,
                points
            }).success
        }
    );

    const handleSortingChange = useCallback((newSorting: SortingState) => {
        setSorting(newSorting);
        if (newSorting.length === 0) {
            setCardHolder(undefined);
            setCardNumber(undefined);
            setCreatedAt(undefined);
            setType(undefined);
            setPoints(undefined);
            return;
        }
        const sort = newSorting[0];
        switch (sort.id) {
            case 'cardHolder':
                setCardHolder(sort.desc ? SortOrder.DESC : SortOrder.ASC);
                setCardNumber(undefined);
                setCreatedAt(undefined);
                setType(undefined);
                setPoints(undefined);
                break;
            case 'cardNumber':
                setCardNumber(sort.desc ? SortOrder.DESC : SortOrder.ASC);
                setCardHolder(undefined);
                setCreatedAt(undefined);
                setType(undefined);
                setPoints(undefined);
                break;
            case 'createdAt':
                setCreatedAt(sort.desc ? SortOrder.DESC : SortOrder.ASC);
                setCardHolder(undefined);
                setCardNumber(undefined);
                setType(undefined);
                setPoints(undefined);
                break;
            case 'type':
                setType(sort.desc ? SortOrder.DESC : SortOrder.ASC);
                setCardHolder(undefined);
                setCardNumber(undefined);
                setCreatedAt(undefined);
                setPoints(undefined);
                break;
            case 'points':
                setPoints(sort.desc ? SortOrder.DESC : SortOrder.ASC);
                setCardHolder(undefined);
                setCardNumber(undefined);
                setCreatedAt(undefined);
                setType(undefined);
                break;
            default:
                break;
        }
    }, []);

    const handleFilterChange = useCallback(
        (states: ColumnFiltersState) => {
            setColumnFilters(states);

            setTypes(undefined);
            setStatuses(undefined);

            states.forEach((state) => {
                switch (state.id) {
                    case "status":
                        setStatuses(
                            state.value
                                ? (Array.isArray(state.value)
                                    ? state.value
                                    : [state.value]) as StatusType[]
                                : undefined
                        );
                        break;

                    case "type":
                        setTypes(
                            state.value
                                ? (Array.isArray(state.value)
                                    ? state.value
                                    : [state.value]) as CardType[]
                                : undefined
                        );
                        break;

                    default:
                        break;
                }
            });

            setPage(1);
        },
        []
    );
    useEffect(() => {
        debounceSearch(searchTerm)
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPage(1)
    }, [debounceSearch, searchTerm])




    if (isError) {
        return (
            <div className="w-full h-48 flex justify-center items-center">
                <Error
                    title="Failed to load cards"
                    description={error?.message || "An error occurred while fetching cards."}
                    onRetry={() => refetch()}
                />
            </div>
        );
    }

    return (
        <DataTable
            columns={columns}
            data={data?.cards || []}
            pagination={data?.pagination ?? {
                currentPage: page,
                limit: limit,
                totalPages: 0,
                totalItems: 0,
            }}
            onPaginationChange={({ page }) => {
                setPage(page);
            }}
            sorting={sorting}
            onSortingChange={handleSortingChange}
            globalFilter={searchTerm}
            onGlobalFilterChange={(value) => setSearchTerm(value)}
            isLoading={isPending}
            columnFilters={columnFilters}
            onColumnFiltersChange={handleFilterChange}

        />
    );
}

