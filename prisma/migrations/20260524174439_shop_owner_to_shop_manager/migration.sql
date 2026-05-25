/*
  Warnings:

  - You are about to drop the `ShopOwner` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ShopManagerStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- DropForeignKey
ALTER TABLE "ShopOwner" DROP CONSTRAINT "ShopOwner_shopId_fkey";

-- DropForeignKey
ALTER TABLE "ShopOwner" DROP CONSTRAINT "ShopOwner_userId_fkey";

-- DropTable
DROP TABLE "ShopOwner";

-- DropEnum
DROP TYPE "ShopOwnerStatus";

-- CreateTable
CREATE TABLE "ShopManager" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "ShopManagerStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "ShopManager_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ShopManager_userId_idx" ON "ShopManager"("userId");

-- CreateIndex
CREATE INDEX "ShopManager_shopId_idx" ON "ShopManager"("shopId");

-- CreateIndex
CREATE UNIQUE INDEX "ShopManager_userId_shopId_key" ON "ShopManager"("userId", "shopId");

-- AddForeignKey
ALTER TABLE "ShopManager" ADD CONSTRAINT "ShopManager_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopManager" ADD CONSTRAINT "ShopManager_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
