"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useWatch } from "react-hook-form"
import { Upload, Plus, Trash2 } from "lucide-react"
import { CldUploadWidget, CloudinaryUploadWidgetError, CloudinaryUploadWidgetResults } from "next-cloudinary"
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap"
import { ShopManagerCombobox } from "@/components/combobox/admin/shop-manager.combobox";
import {api} from "@/trpc/react";

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
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Media } from "@/components/media/media"

import { createShopFrontEndSchema, type CreateShopFrontEndForm , type CreateShopBackEndForm} from "@/lib/schema/admin/shop"
import { CategoryCombobox } from "@/components/combobox/admin/category.combobox";
import { GstCombobox } from "@/components/combobox/admin/gst.combobox";
import {toast} from "sonner";

export function CreateShopForm() {
    const form = useForm<CreateShopFrontEndForm>({
        resolver: zodResolver(createShopFrontEndSchema),
        defaultValues: {
            name: "",
            code: "",
            description: "",
            email: "",
            phone: "",
            address: {
                addressLine: "",
                city: "",
                state: "",
                postalCode: "",
                country: ""
            },
            categoryId: "",
            stateGstId: "",
            media: [],
            shopManagerId: ""
        },
        mode: "onChange",
    });

    const createShopMutation = api.admin.shop.createShop.useMutation();

    const [mediaCount, setMediaCount] = useState<number>(1);
    const mediaFiles = useWatch({ control: form.control, name: "media" }) || [];

    const handleAddMedia = () => {
        if (mediaCount < 5) {
            setMediaCount((prev) => prev + 1);
        }
    };

    const handleRemoveMedia = (indexToRemove: number) => {
        if (mediaCount > 1) {
            setMediaCount((prev) => prev - 1);
            const currentMedia = form.getValues("media") || [];
            // Remove the specific item from the form state array
            const newMedia = currentMedia.filter((_, idx) => idx !== indexToRemove);
            form.setValue("media", newMedia, { shouldValidate: true });
        }
    };

    function handleSubmit(data: CreateShopFrontEndForm) {
        toast.promise(createShopMutation.mutateAsync(data as CreateShopBackEndForm), {
            loading: "Creating shop...",
            success: "Shop created successfully!",
            error: (err) => `Failed to create shop: ${err.message}`,
        });
    }

    return (
        <Card className="w-full">
            <CardHeader className="bg-muted/30 pb-8">
                <CardTitle className="text-2xl">Create New Shop</CardTitle>
                <CardDescription className="text-base">
                    Fill out the information below to register a new shop in the system.
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
                <form id="create-shop-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">

                    {/* SECTION 1: General Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold tracking-tight">General Information</h3>
                        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="name-input">Shop Name</FieldLabel>
                                        <Input {...field} id="name-input" placeholder="My Awesome Shop" />
                                        <FieldDescription>Unique name for the shop.</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="code"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="code-input">Shop Code</FieldLabel>
                                        <Input {...field} id="code-input" placeholder="SH001" />
                                        <FieldDescription>Unique identifier code for the shop.</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="description"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="md:col-span-2">
                                        <FieldLabel htmlFor="description-input">Description</FieldLabel>
                                        <MinimalTiptapEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                            className="w-full"
                                            editorContentClassName="p-5"
                                            output="text"
                                            placeholder="Enter your shop description..."
                                            autofocus={false}
                                            editable={true}
                                            editorClassName="focus:outline-hidden min-h-[120px]"
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </div>

                    <Separator />

                    {/* SECTION 2: Contact Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold tracking-tight">Contact Information</h3>
                        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="email-input">Email Address</FieldLabel>
                                        <Input {...field} id="email-input" type="email" placeholder="shop@example.com" />
                                        <FieldDescription>Primary contact email for the shop.</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="phone"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="phone-input">Phone Number</FieldLabel>
                                        <Input {...field} id="phone-input" type="tel" placeholder="+1 (555) 000-0000" />
                                        <FieldDescription>Primary contact number.</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </div>

                    <Separator />

                    {/* SECTION 3: Location Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold tracking-tight">Location Details</h3>
                        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Controller
                                name="address.addressLine"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="md:col-span-2">
                                        <FieldLabel htmlFor="addressLine-input">Street Address</FieldLabel>
                                        <Input {...field} id="addressLine-input" placeholder="123 Main St, Shop 4B" />
                                        <FieldDescription>Full street address or building number.</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="address.city"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="addressCity-input">City</FieldLabel>
                                        <Input {...field} id="addressCity-input" placeholder="e.g. New York" />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="address.state"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="addressState-input">State / Province</FieldLabel>
                                        <Input {...field} id="addressState-input" placeholder="e.g. NY" />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="address.postalCode"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="addressPostalCode-input">Postal / ZIP Code</FieldLabel>
                                        <Input {...field} id="addressPostalCode-input" placeholder="10001" />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="address.country"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="addressCountry-input">Country</FieldLabel>
                                        <Input {...field} id="addressCountry-input" placeholder="United States" />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </div>

                    <Separator />

                    {/* SECTION 4: Classification & Management */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold tracking-tight">Classification & Management</h3>
                        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Controller
                                name="categoryId"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Category</FieldLabel>
                                        <CategoryCombobox value={field.value} onChange={field.onChange} />
                                        <FieldDescription>Select the primary category for this shop.</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="stateGstId"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>State GST</FieldLabel>
                                        <GstCombobox value={field.value} onChange={field.onChange} />
                                        <FieldDescription>Select the applicable state GST.</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="shopManagerId"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="md:col-span-2">
                                        <FieldLabel>Shop Manager</FieldLabel>
                                        <ShopManagerCombobox value={field.value} onChange={field.onChange} />
                                        <FieldDescription>Assign a registered manager to this shop.</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </div>

                    <Separator />

                    {/* SECTION 5: Shop Media Gallery */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold tracking-tight">Shop Media Gallery</h3>
                            <span className="text-sm text-muted-foreground">{mediaCount} / 5 Images Added</span>
                        </div>
                        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Array.from({ length: mediaCount }).map((_, index) => (
                                <div key={index} className="space-y-4 border p-4 rounded-lg bg-muted/10 relative shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-sm text-muted-foreground">Media Slot {index + 1}</span>
                                        {mediaCount > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => handleRemoveMedia(index)}
                                            >
                                                <Trash2 className="w-4 h-4 mr-1.5" /> Remove
                                            </Button>
                                        )}
                                    </div>
                                    <Controller
                                        name={`media.${index}`}
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <CldUploadWidget
                                                    signatureEndpoint="/api/sign-cloudinary-params"
                                                    uploadPreset="kisan-card"
                                                    onSuccess={(result: CloudinaryUploadWidgetResults) => {
                                                        if (typeof result.info !== "string" && result.info?.secure_url) {
                                                            field.onChange({
                                                                url: result.info.secure_url,
                                                                type: result.info.resource_type === "image" ? "IMAGE" : "VIDEO",
                                                            });
                                                            toast.success(`Media ${index + 1} uploaded!`);
                                                        }
                                                    }}
                                                    onError={(error: CloudinaryUploadWidgetError) => toast.error(`Upload failed: ${error}`)}
                                                    options={{
                                                        maxFiles: 1,
                                                        maxImageFileSize: 2097152,
                                                        sources: ["local", "camera"],
                                                        cropping: true,
                                                        clientAllowedFormats: ["png", "jpeg", "jpg"],
                                                        multiple: false,
                                                        resourceType: "auto",
                                                    }}
                                                >
                                                    {({ open }) => (
                                                        <Button type="button" variant="outline" className="w-full bg-background" onClick={() => open()}>
                                                            {mediaFiles[index] ? "Change Media Image" : "Upload Media Image"} <Upload className="ms-2 h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </CldUploadWidget>
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}

                                                {/* Added optional chaining `mediaFiles[index]?.url` for crash safety */}
                                                {mediaFiles[index]?.url && (
                                                    <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-md border bg-muted mt-4 flex justify-center items-center">
                                                        <Media url={mediaFiles[index].url} type={mediaFiles[index].type || "IMAGE"} className="object-cover w-full h-full" />
                                                    </AspectRatio>
                                                )}
                                            </Field>
                                        )}
                                    />
                                </div>
                            ))}

                            {/* Add New Media Button */}
                            {mediaCount < 5 && (
                                <div className="border p-4 rounded-lg bg-muted/5 border-dashed flex items-center justify-center min-h-[160px]">
                                    <Button type="button" variant="secondary" onClick={handleAddMedia} className="w-full max-w-[200px]">
                                        <Plus className="mr-2 h-4 w-4" /> Add Media Slot
                                    </Button>
                                </div>
                            )}
                        </FieldGroup>
                    </div>

                </form>
            </CardContent>

            <Separator />

            <CardFooter className="pt-6 bg-muted/10 rounded-b-xl flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => form.reset()}>
                    Clear Form
                </Button>
                <Button type="submit" form="create-shop-form" disabled={!form.formState.isValid || form.formState.isSubmitting} className="min-w-30">
                    Create Shop
                </Button>
            </CardFooter>
        </Card>
    )
}