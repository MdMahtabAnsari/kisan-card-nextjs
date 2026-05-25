"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

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
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { statusUpdateSchema, type StatusUpdateSchema } from "@/lib/schema/common/status"
import { StatusType } from "@/generated/prisma/browser";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface StatusUpdateFormProps {
  status?: StatusType;
  onSubmit?: (data: StatusUpdateSchema) => void;
}

export function StatusUpdateForm({ status, onSubmit }: StatusUpdateFormProps) {
  const form = useForm<StatusUpdateSchema>({
    resolver: zodResolver(statusUpdateSchema),
    defaultValues: {
      status: status || StatusType.PENDING,
      notes: "",
    },
    mode: "onChange",
  })

  function handleSubmit(data: StatusUpdateSchema) {
    onSubmit?.({...data,notes: data.notes? data.notes.trim().length === 0 ? undefined : data.notes : undefined});
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Status Update</CardTitle>
        <CardDescription>
          Update the status of your request.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="status-form" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="status-select">
                    Status
                  </FieldLabel>
                  <Select
                    {...field}
                    value={field.value}
                    disabled={!!status}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="status-select">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status Options</SelectLabel>
                        {Object.values(StatusType).map((statusOption) => (
                          <SelectItem key={statusOption} value={statusOption}>
                            {statusOption}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="notes"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="status-notes">
                    Notes
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="status-notes"
                      placeholder="Provide additional details about the status update"
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value?.length || 0} / 500
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>
                    Optional notes to provide more context about the status change.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => {
            form.reset({
              status: status ?? StatusType.PENDING,
              notes: "",
            })
          }}>
            Reset
          </Button>
          <Button type="submit" form="status-form" disabled={!form.formState.isValid}>
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
