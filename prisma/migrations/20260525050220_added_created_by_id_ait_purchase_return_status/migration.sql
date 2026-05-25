/*
  Warnings:

  - Added the required column `createdById` to the `PurchaseReturnStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PurchaseReturnStatus" ADD COLUMN     "createdById" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "PurchaseReturnStatus_createdById_idx" ON "PurchaseReturnStatus"("createdById");

-- AddForeignKey
ALTER TABLE "PurchaseReturnStatus" ADD CONSTRAINT "PurchaseReturnStatus_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
