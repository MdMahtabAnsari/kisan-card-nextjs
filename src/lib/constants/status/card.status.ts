import { StatusType } from "@/generated/prisma/enums";

export const CARD_STATUS_ACTIONS: Partial<
  Record<StatusType, StatusType[]>
> = {
  [StatusType.PENDING]: [
    StatusType.APPROVED,
    StatusType.REJECTED,
  ],

  [StatusType.APPROVED]: [
    StatusType.ACTIVE,
    StatusType.FAILED,
  ],

  [StatusType.REJECTED]: [],

  [StatusType.ACTIVE]: [
    StatusType.INACTIVE,
    StatusType.BLOCKED,
  ],

  [StatusType.INACTIVE]: [
    StatusType.ACTIVE,
  ],

  [StatusType.BLOCKED]: [
    StatusType.ACTIVE,
  ],

  [StatusType.FAILED]: [
    StatusType.PENDING,
  ],
};