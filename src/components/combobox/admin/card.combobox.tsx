"use client";
import { api } from "@/trpc/react";
import { useEffect, useState } from "react";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { useDebounceCallback } from 'usehooks-ts'
import {CardItem} from "@/components/combobox/item/card.item";
import { useInView } from "react-intersection-observer";
import { Spinner } from "@/components/ui/spinner";

interface CardComboboxProps {
    value: string;
    onChange: (value: string) => void;
}

export function CardCombobox({ value, onChange }: CardComboboxProps) {
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
    } = api.admin.card.getCardsInfiniteScroll.useInfiniteQuery(
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

    const items = data?.pages.flatMap((p) => p.cards) ?? [];
    const formattedItems = items.map((item) => ({
        id: item.id,
        label: item,
    }));


    return (
        <Combobox items={formattedItems}
                  value={value}
                  onValueChange={(selectedId) => {
                      onChange(selectedId ? selectedId : "");
                      setSearchTerm(selectedId ? selectedId : "");
                  }}
                  open={open}
                  onOpenChange={setOpen}>
            <ComboboxInput
                placeholder="Select a Card"
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
                                        <CardItem

                                            cardNumber={item.label.cardNumber}
                                            cardHolder={item.label.cardHolder}
                                            cardType={item.label.type}
                                            points={Number(item.label.points)}
                                            cardExpiryDate={item.label.expiryDate}
                                            status={item.label.statuses.find(status=>status.isCurrent)?.status.name}
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