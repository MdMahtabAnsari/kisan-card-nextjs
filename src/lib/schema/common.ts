import {z} from "zod"

export const aadhaarNumber = z.string().regex(/^\d{12}$/, "Aadhaar number must be a 12-digit numeric string")