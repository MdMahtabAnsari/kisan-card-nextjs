
import {authClient} from "@/lib/auth/auth-client"
import {UserRole} from "@/generated/prisma/client"
import {StatusType} from "@/generated/prisma/enums";

type InferUser = typeof authClient.$Infer.Session.user

export type User = Omit<InferUser, "role"> & {
  role: UserRole
}



export interface CreateUserStatus {
    status: StatusType;
    notes?: string;
    createdById: string;
    userId: string;
}