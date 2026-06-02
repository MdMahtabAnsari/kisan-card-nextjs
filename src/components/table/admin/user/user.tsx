"use client";
import { getColumns } from "@/components/table/admin/user/column";
import { api } from "@/trpc/react";
import { DataTable } from "@/components/table/data.table";
import { useState } from "react";
import { Error } from "@/components/error/error";
import type { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { useCallback, useEffect } from "react";
import { useDebounceCallback } from 'usehooks-ts'
import { filterUserSchema } from "@/lib/schema/admin/user";
import { SortOrder } from "@/lib/types/sort";
import { StatusType, UserRole } from "@/generated/prisma/browser";
import { UserStatusUpdateSchema } from "@/lib/schema/common/user";
import { toast } from "sonner";

export function UserTable() {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [name, setName] = useState<SortOrder | undefined>(undefined);
    const [email, setEmail] = useState<SortOrder | undefined>(undefined);
    const [role, setRole] = useState<SortOrder | undefined>(undefined);
    const [sorting, setSorting] = useState<SortingState>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)
    const debounceSearch = useDebounceCallback(setDebouncedSearchTerm, 300)
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [roles, setRoles] = useState<UserRole[] | undefined>(undefined);
    const [emailVerified, setEmailVerified] = useState<boolean | undefined>(undefined);
    const [phoneNumberVerified, setPhoneNumberVerified] = useState<boolean | undefined>(undefined);
    const [banned, setBanned] = useState<boolean | undefined>(undefined);
    const [createdAt, setCreatedAt] = useState<SortOrder | undefined>(undefined);

    const [status, setStatus] = useState<StatusType[] | undefined>(undefined);




    const { data, isPending, error, isError, refetch } = api.admin.user.getUsers.useQuery(
        {
            pageLimit: { page, limit },
            name,
            email,
            role,
            search: debouncedSearchTerm.trim() === '' ? undefined : debouncedSearchTerm,
            roles,
            emailVerified,
            phoneNumberVerified,
            banned,
            status,
            createdAt
        },
        {
            enabled: filterUserSchema.safeParse({
                pageLimit: { page, limit },
                name,
                email,
                role,
                search: debouncedSearchTerm.trim() === '' ? undefined : debouncedSearchTerm,
                status,
                createdAt
            }).success
        }
    );

    const statusUpdateMutation = api.admin.user.updateUserStatus.useMutation({
        onSuccess: () => {
            refetch();
        }
    })

    const onStatusUpdate = useCallback((values: UserStatusUpdateSchema) => {

        toast.promise(
            statusUpdateMutation.mutateAsync(values),
            {
                loading: 'Updating user status...',
                success: 'User status updated successfully!',
                error: (err) => `Failed to update user status: ${err.message}`,
            }
        );

    }, [statusUpdateMutation])

    const columns = getColumns({ onStatusUpdate });

    const handleSortingChange = useCallback((newSorting: SortingState) => {
        setSorting(newSorting);
        if (newSorting.length === 0) {
            setName(undefined);
            setEmail(undefined);
            setRole(undefined);
            setCreatedAt(undefined);
            return;
        }
        const sort = newSorting[0];
        switch (sort.id) {
            case 'name':
                setName(sort.desc ? SortOrder.DESC : SortOrder.ASC);
                setEmail(undefined);
                setRole(undefined);
                setCreatedAt(undefined);
                break;
            case 'email':
                setEmail(sort.desc ? SortOrder.DESC : SortOrder.ASC);
                setName(undefined);
                setRole(undefined);
                setCreatedAt(undefined);
                break;
            case 'role':
                setRole(sort.desc ? SortOrder.DESC : SortOrder.ASC);
                setName(undefined);
                setEmail(undefined);
                setCreatedAt(undefined);
                break;
            case 'createdAt':
                setCreatedAt(sort.desc ? SortOrder.DESC : SortOrder.ASC);
                setName(undefined);
                setEmail(undefined);
                setRole(undefined);
                break;
            default:
                break;
        }
    }, []);

    const handleFilterChange = useCallback(
        (states: ColumnFiltersState) => {
            setColumnFilters(states);

            setRoles(undefined);
            setEmailVerified(undefined);
            setPhoneNumberVerified(undefined);
            setBanned(undefined);
            setStatus(undefined);

            states.forEach((state) => {
                switch (state.id) {
                    case "role":
                        setRoles(
                            state.value
                                ? (Array.isArray(state.value)
                                    ? state.value
                                    : [state.value]) as UserRole[]
                                : undefined
                        );
                        break;

                    case "emailVerified":
                        setEmailVerified(
                            typeof state.value === "boolean"
                                ? state.value
                                : undefined
                        );
                        break;

                    case "phoneNumberVerified":
                        setPhoneNumberVerified(
                            typeof state.value === "boolean"
                                ? state.value
                                : undefined
                        );
                        break;

                    case "banned":
                        setBanned(
                            typeof state.value === "boolean"
                                ? state.value
                                : undefined
                        );
                        break;

                    case "userStatuses":
                        setStatus(
                            state.value
                                ? (Array.isArray(state.value)
                                    ? state.value
                                    : [state.value]) as StatusType[]
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
                    title="Failed to load users"
                    description={error?.message || "An error occurred while fetching users."}
                    onRetry={() => refetch()}
                />
            </div>
        );
    }

    return (
        <DataTable
            columns={columns}
            data={data?.users || []}
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

