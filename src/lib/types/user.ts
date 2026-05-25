
import {authClient} from "@/lib/auth/auth-client"
import {UserRole} from "@/generated/prisma/client"

type InferUser = typeof authClient.$Infer.Session.user

export type User = Omit<InferUser, "role"> & {
  role: UserRole
}