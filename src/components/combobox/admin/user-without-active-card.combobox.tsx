"use client";
import { api } from "@/trpc/react";
import { useEffect, useState } from "react";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { useDebounceCallback } from 'usehooks-ts'
import { UserItem } from "@/components/combobox/item/user.item";
import { UserRole } from "@/generated/prisma/enums";
import { useInView } from "react-intersection-observer";
import { Spinner } from "@/components/ui/spinner";

interface UserWithoutActiveCardComboboxProps {
    value: string;
    onChange: (value: string) => void;
}

export function UserWithoutActiveCardCombobox({ value, onChange }: UserWithoutActiveCardComboboxProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)
    const debounceSearch = useDebounceCallback(setDebouncedSearchTerm, 300)
    const limit = 10;

    const { ref, inView } = useInView();
    const [open, setOpen] = useState(false);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = api.admin.user.getUsersWithoutActiveCardInfiniteScroll.useInfiniteQuery(
        {
            search: debouncedSearchTerm.trim() === "" ? undefined : debouncedSearchTerm,
            limit,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            initialCursor: undefined,
        }
    );

    useEffect(() => {
        debounceSearch(searchTerm)
    }, [debounceSearch, searchTerm])

    useEffect(() => {
        if (inView && open && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [
        inView,
        open,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    ]);

    const items = data?.pages.flatMap((p) => p.users) ?? [];
    const formattedItems = items.map((item) => ({
        id: item.id,
        label: item,
    }));


    return (
        <Combobox items={formattedItems}
                  value={value}
                  onValueChange={(selectedId) => {
                      onChange(selectedId?selectedId:"");
                      setSearchTerm(selectedId?selectedId:"");
                  }}
                  open={open}
                  onOpenChange={setOpen}>
            <ComboboxInput
                placeholder="Select a shop manager"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ComboboxContent>

                <ComboboxList>
                    {formattedItems.map((item) => {

                        return (
                            <ComboboxItem
                                key={item.id}
                                value={item.id}
                            >
                                {/* Wrap the card and the checkmark in a flex container */}
                                <div className="flex w-full items-center justify-between">
                                    <div className="flex-1">
                                        <UserItem
                                            name={item.label.name}
                                            username={item.label.username || undefined}
                                            email={item.label.email}
                                            role={item.label.role as UserRole}
                                            image={item.label.image || undefined}
                                        />
                                    </div>
                                </div>
                            </ComboboxItem>
                        );
                    })}
                    <div ref={ref} className="py-2 text-center text-sm opacity-70">
                        {isFetchingNextPage
                            ? <Spinner className="mx-auto" />
                            : hasNextPage
                                ? "Scroll to load more"
                                : <ComboboxEmpty>No items found.</ComboboxEmpty>}
                    </div>
                </ComboboxList>



            </ComboboxContent>
        </Combobox>
    );
}