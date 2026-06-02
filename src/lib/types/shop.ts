import {StatusType} from "@/generated/prisma/enums";


export interface CreateShopStatus {
    status: StatusType;
    notes?: string;
    createdById: string;
    shopId: string;
}