"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { ActiveShopCombobox } from "@/components/combobox/admin/active-shop.combobox"
import { UserWithoutActiveCardCombobox } from "@/components/combobox/admin/user-without-active-card.combobox"
import { api } from "@/trpc/react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { CardType } from "@/generated/prisma/enums"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { createCardSchema, type CreateCardForm } from "@/lib/schema/admin/card"
import { toast } from "sonner"

export function CreateCardForm() {
    const form = useForm<CreateCardForm>({
        resolver: zodResolver(createCardSchema),
        defaultValues: {
            cardHolder: "",
            cardNumber: "",
            type: "STANDARD",
            points: "0",
            userId: "",
            shopId: ""
        },
        mode: "onChange",
    });

    const createCardMutation = api.admin.card.createCard.useMutation();

    function handleSubmit(data: CreateCardForm) {
        toast.promise(createCardMutation.mutateAsync(data), {
            loading: "Creating card...",
            success: "Card created successfully!",
            error: (err) => `Failed to create card: ${err.message}`,
        });
    }

    return (
        <Card className="w-full">
            <CardHeader className="bg-muted/30 pb-8">
                <CardTitle className="text-2xl">Create New Card</CardTitle>
                <CardDescription className="text-base">
                    Fill out the information below to register a new card in the system.
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
                <form id="create-card-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">

                    {/* SECTION 1: Card Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold tracking-tight">Card Details</h3>
                        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Controller
                                name="cardHolder"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="cardHolder-input">Card Holder Name</FieldLabel>
                                        <Input {...field} id="cardHolder-input" placeholder="e.g. John Doe" />
                                        <FieldDescription>Full name of the cardholder.</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="cardNumber"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="cardNumber-input">Card Number</FieldLabel>
                                        <Input {...field} id="cardNumber-input" placeholder="e.g. 1234567890121016" />
                                        <FieldDescription>Unique identifier number for the card.</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="type"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="type-input">Card Type</FieldLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} {...field}>
                                            <SelectTrigger id="type-input">
                                                <SelectValue placeholder="Select a Card Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Available Tiers</SelectLabel>
                                                    <SelectItem value={CardType.STANDARD}>Standard</SelectItem>
                                                    <SelectItem value={CardType.PREMIUM}>Premium</SelectItem>
                                                    <SelectItem value={CardType.VIP}>VIP</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FieldDescription>Determines the tier and privileges of the card.</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            {/* Added Points Input Field Here */}
                            <Controller
                                name="points"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="points-input">Initial Points</FieldLabel>
                                        <Input {...field} id="points-input" type="number" placeholder="0" />
                                        <FieldDescription>Starting points balance for the card.</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </div>

                    <Separator />

                    {/* SECTION 2: Associations */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold tracking-tight">Assignments</h3>
                        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Controller
                                name="userId"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>User</FieldLabel>
                                        <UserWithoutActiveCardCombobox value={field.value} onChange={field.onChange} />
                                        <FieldDescription>Select the user for the card.</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="shopId"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Shop</FieldLabel>
                                        <ActiveShopCombobox value={field.value} onChange={field.onChange} />
                                        <FieldDescription>Select the shop associated with the card.</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </div>

                </form>
            </CardContent>

            <Separator />

            <CardFooter className="pt-6 bg-muted/10 rounded-b-xl flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => form.reset()}>
                    Clear Form
                </Button>
                <Button
                    type="submit"
                    form="create-card-form"
                    disabled={!form.formState.isValid || form.formState.isSubmitting}
                    className="min-w-30"
                >
                    Create Card
                </Button>
            </CardFooter>
        </Card>
    )
}