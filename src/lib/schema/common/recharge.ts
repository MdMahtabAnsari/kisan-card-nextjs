import {z} from "zod";
import {PaymentMethod} from "@/generated/prisma/enums";
import {Provider} from "@/generated/prisma/enums"
import {cardByIdOrNumberSchema} from "@/lib/schema/admin/card";

export const paymentMethodEnum = z.enum([PaymentMethod.PAYMENT_GATEWAY,PaymentMethod.CASH])


export const createRechargeSchema = z.object({
    identifier:cardByIdOrNumberSchema,
    amount:z.string().min(1).max(10).regex(/^\d+(\.\d{1,2})?$/,"Amount must be a valid decimal number with up to 2 decimal places"),

})

export type CreateRechargeSchema = z.infer<typeof createRechargeSchema>

export const createPaymentSchema = z.object({
    rechargeId:z.uuid(),
    paymentMethod:paymentMethodEnum,
    provider:z.enum(Provider).optional(),
})

export type CreatePaymentSchema = z.infer<typeof createPaymentSchema>

export const verifyPaymentSchema = z.object({
    provider:z.enum(Provider),
    orderId:z.string(),
    paymentId:z.string().optional(),
    signature:z.string().optional()
})

export type VerifyPaymentSchema = z.infer<typeof verifyPaymentSchema>
