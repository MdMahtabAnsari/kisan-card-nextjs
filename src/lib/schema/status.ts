import {z} from "zod";
import {StatusType} from "@/generated/prisma/client"

export const statusEnum = z.enum(StatusType);