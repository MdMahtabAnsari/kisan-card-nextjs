import { StatusType } from "@/generated/prisma/enums";

export interface CreateCardStatus {
    cardId: string;
    status: StatusType;
    userId: string;
    notes?: string;
}