"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useWatch } from "react-hook-form"
import { Eye, EyeClosed, Upload } from "lucide-react"
import { CldUploadWidget, CloudinaryUploadWidgetError, CloudinaryUploadWidgetResults } from "next-cloudinary"
import { toast } from "sonner"

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
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Media } from "@/components/media/media"

import { createUserSchema, type CreateUserForm } from "@/lib/schema/admin/user"
import { UserRole, MediaType } from "@/generated/prisma/browser"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {api} from "@/trpc/react";

export function CreateUserForm() {
    const form = useForm<CreateUserForm>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            image: "",
            phoneNumber: "",
            username: "",
            displayUsername: "",
            role: UserRole.USER,
            aadhaarNumber: "",
            address: {
                addressLine: "",
                city: "",
                state: "",
                postalCode: "",
                country: "",
            },
            aadhaarFront: {
                url: "",
                type: MediaType.IMAGE,
            },
            aadhaarBack: {
                url: "",
                type: MediaType.IMAGE,
            },
        },
        mode: "onChange",
    });

    const createUserMutation = api.admin.user.createUser.useMutation();

    const aadhaarFront = useWatch({
        control: form.control,
        name: "aadhaarFront",
    })

    const aadhaarBack = useWatch({
        control: form.control,
        name: "aadhaarBack",
    })

    const image = useWatch({
        control: form.control,
        name: "image",
    })

    const displayUsername = useWatch({
        control: form.control,
        name: "displayUsername",
    })

    const [showPassword, setShowPassword] = useState<boolean>(false)

    function handleSubmit(data: CreateUserForm) {
        toast.promise(createUserMutation.mutateAsync(data), {
            loading: "Creating user...",
            success: "User created successfully!",
            error: (err) => `Error creating user: ${err.message}`,
        });
    }

    return (
        <Card className="w-full">
            <CardHeader className="bg-muted/30 pb-8">
                <CardTitle className="text-2xl">Create New User</CardTitle>
                <CardDescription className="text-base">
                    Fill out the information below to register a new user in the system.
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
                <form id="create-user-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">

                    {/* SECTION 1: Account Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold tracking-tight">Account Information</h3>
                        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Controller
                                name="username"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="username-input">Username</FieldLabel>
                                        <Input {...field} id="username-input" placeholder="johndoe123" />
                                        <FieldDescription>Unique username for login.</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="displayUsername"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="displayUsername-input">Display Username</FieldLabel>
                                        <Input {...field} id="displayUsername-input" placeholder="John Doe" />
                                        <FieldDescription>Publicly visible name.</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="email-input">Email Address</FieldLabel>
                                        <Input {...field} id="email-input" type="email" placeholder="john@example.com" />
                                        <FieldDescription>Primary contact email.</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="password-input">Password</FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput
                                                {...field}
                                                id="password-input"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                            />
                                            <InputGroupAddon align="inline-end">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <EyeClosed className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </Button>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        <FieldDescription>Secure account password.</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="role"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="md:col-span-2">
                                        <FieldLabel htmlFor="role-input">User Role</FieldLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} {...field}>
                                            <SelectTrigger id="role-input">
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Available Roles</SelectLabel>
                                                    <SelectItem value={UserRole.SHOP_MANAGER}>Shop Manager</SelectItem>
                                                    <SelectItem value={UserRole.WAREHOUSE_MANAGER}>Warehouse Manager</SelectItem>
                                                    <SelectItem value={UserRole.USER}>Standard User</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FieldDescription>Determines system permissions.</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </div>

                    <Separator />

                    {/* SECTION 2: Personal Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold tracking-tight">Personal Information</h3>
                        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="name-input">Full Name</FieldLabel>
                                        <Input {...field} id="name-input" placeholder="e.g. John Doe" />
                                        <FieldDescription>Legal full name.</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="phoneNumber"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="phoneNumber-input">Phone Number</FieldLabel>
                                        <Input {...field} type="tel" id="phoneNumber-input" placeholder="+1 (555) 000-0000" />
                                        <FieldDescription>Primary contact number.</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </div>

                    <Separator />

                    {/* SECTION 3: Address Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold tracking-tight">Address Details</h3>
                        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Controller
                                name="address.addressLine"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="md:col-span-2">
                                        <FieldLabel htmlFor="addressLine-input">Street Address</FieldLabel>
                                        <Input {...field} id="addressLine-input" placeholder="123 Main St, Apt 4B" />
                                        <FieldDescription>Full street address or P.O. Box.</FieldDescription>
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
                                        <Input {...field} id="addressCity-input" />
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
                                        <Input {...field} id="addressState-input" />
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
                                        <Input {...field} id="addressPostalCode-input" />
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
                                        <Input {...field} id="addressCountry-input" />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </div>

                    <Separator />

                    {/* SECTION 4: Identity & Documents */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold tracking-tight">Identity & Documents</h3>
                        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            <Controller
                                name="aadhaarNumber"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="md:col-span-2">
                                        <FieldLabel htmlFor="aadhaarNumber-input">Document Number</FieldLabel>
                                        <Input {...field} id="aadhaarNumber-input" placeholder="XXXX XXXX XXXX" />
                                        <FieldDescription>Government issued identification number.</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            {/* Profile Image Upload (UPDATED) */}
                            <div className="flex flex-col items-center justify-center space-y-6 border p-6 rounded-lg bg-muted/10 md:col-span-2">
                                <Avatar className="h-28 w-28 border-2 shadow-sm">
                                    <AvatarImage src={image || undefined} alt="Profile Picture" className="object-cover" />
                                    <AvatarFallback className="text-3xl bg-muted">
                                        {displayUsername?.charAt(0)?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>

                                <Controller
                                    name="image"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="flex flex-col items-center w-full max-w-sm text-center">
                                            <CldUploadWidget
                                                signatureEndpoint="/api/sign-cloudinary-params"
                                                uploadPreset="kisan-card"
                                                onSuccess={(result: CloudinaryUploadWidgetResults) => {
                                                    if (typeof result.info !== "string" && result.info?.secure_url) {
                                                        field.onChange(result.info.secure_url)
                                                        toast.success("Profile image uploaded!")
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
                                                    <Button type="button" variant="secondary" onClick={() => open()}>
                                                        {image ? "Change Avatar" : "Upload Avatar"} <Upload className="ms-2 h-4 w-4" />
                                                    </Button>
                                                )}
                                            </CldUploadWidget>
                                            <FieldDescription className="mt-2">Upload a recognizable profile picture.</FieldDescription>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                            </div>

                            {/* Aadhaar Front Upload */}
                            <div className="space-y-4 border p-4 rounded-lg bg-muted/10">
                                <Controller
                                    name="aadhaarFront"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>ID Document (Front)</FieldLabel>
                                            <CldUploadWidget
                                                signatureEndpoint="/api/sign-cloudinary-params"
                                                uploadPreset="kisan-card"
                                                onSuccess={(result: CloudinaryUploadWidgetResults) => {
                                                    if (typeof result.info !== "string" && result.info?.secure_url) {
                                                        console.log("Upload successful:", result.info)
                                                        field.onChange({
                                                            url: result.info.secure_url,
                                                            type: result.info.resource_type === "image" ? "IMAGE" : "VIDEO",
                                                        })
                                                        toast.success("Front document uploaded!")
                                                    }
                                                }}
                                                onError={(error: CloudinaryUploadWidgetError) => toast.error(`Upload failed: ${error}`)}
                                                options={{
                                                    maxFiles: 1, maxImageFileSize: 2097152, sources: ["local", "camera"],
                                                    resourceType: "auto",
                                                    clientAllowedFormats: ["png", "jpeg", "jpg"],
                                                    multiple: false,
                                                }}
                                            >
                                                {({ open }) => (
                                                    <Button type="button" variant="outline" className="w-full" onClick={() => open()}>
                                                        Upload Front Image <Upload className="ms-2 h-4 w-4" />
                                                    </Button>
                                                )}
                                            </CldUploadWidget>
                                            <FieldDescription>Upload a clear photo of the front.</FieldDescription>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                                {aadhaarFront.url && (
                                    <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-md border bg-muted flex justify-center items-center">
                                        <Media url={aadhaarFront.url} type={aadhaarFront.type} />
                                    </AspectRatio>
                                )}
                            </div>

                            {/* Aadhaar Back Upload */}
                            <div className="space-y-4 border p-4 rounded-lg bg-muted/10">
                                <Controller
                                    name="aadhaarBack"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>ID Document (Back)</FieldLabel>
                                            <CldUploadWidget
                                                signatureEndpoint="/api/sign-cloudinary-params"
                                                uploadPreset="kisan-card"
                                                onSuccess={(result: CloudinaryUploadWidgetResults) => {
                                                    if (typeof result.info !== "string" && result.info?.secure_url) {
                                                        field.onChange({
                                                            url: result.info.secure_url,
                                                            type: result.info.resource_type === "image" ? "IMAGE" : "VIDEO",
                                                        })
                                                        toast.success("Back document uploaded!")
                                                    }
                                                }}
                                                onError={(error: CloudinaryUploadWidgetError) => toast.error(`Upload failed: ${error}`)}
                                                options={{
                                                    maxFiles: 1, maxImageFileSize: 2097152, sources: ["local", "camera"],
                                                    resourceType: "auto",
                                                    clientAllowedFormats: ["png", "jpeg", "jpg"],
                                                    multiple: false,
                                                }}
                                            >
                                                {({ open }) => (
                                                    <Button type="button" variant="outline" className="w-full" onClick={() => open()}>
                                                        Upload Back Image <Upload className="ms-2 h-4 w-4" />
                                                    </Button>
                                                )}
                                            </CldUploadWidget>
                                            <FieldDescription>Upload a clear photo of the back.</FieldDescription>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                                {aadhaarBack.url && (
                                    <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-md border bg-muted flex justify-center items-center">
                                        <Media url={aadhaarBack.url} type={aadhaarBack.type} />
                                    </AspectRatio>
                                )}
                            </div>

                        </FieldGroup>
                    </div>

                </form>
            </CardContent>

            <Separator />

            <CardFooter className="pt-6 bg-muted/10 rounded-b-xl flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => form.reset()}>
                    Clear Form
                </Button>
                <Button type="submit" form="create-user-form" disabled={!form.formState.isValid || form.formState.isSubmitting} className="min-w-30">
                    Create User
                </Button>
            </CardFooter>
        </Card>
    )
}