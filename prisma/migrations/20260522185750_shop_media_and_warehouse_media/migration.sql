/*
  Warnings:

  - You are about to drop the column `photo` on the `Shop` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Shop" DROP COLUMN "photo";

-- AlterTable
ALTER TABLE "Warehouse" ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "ShopMedia" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarehouseMedia" (
    "id" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WarehouseMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ShopMedia_shopId_idx" ON "ShopMedia"("shopId");

-- CreateIndex
CREATE INDEX "ShopMedia_mediaId_idx" ON "ShopMedia"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "ShopMedia_shopId_mediaId_key" ON "ShopMedia"("shopId", "mediaId");

-- CreateIndex
CREATE INDEX "WarehouseMedia_warehouseId_idx" ON "WarehouseMedia"("warehouseId");

-- CreateIndex
CREATE INDEX "WarehouseMedia_mediaId_idx" ON "WarehouseMedia"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "WarehouseMedia_warehouseId_mediaId_key" ON "WarehouseMedia"("warehouseId", "mediaId");

-- AddForeignKey
ALTER TABLE "ShopMedia" ADD CONSTRAINT "ShopMedia_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopMedia" ADD CONSTRAINT "ShopMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseMedia" ADD CONSTRAINT "WarehouseMedia_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseMedia" ADD CONSTRAINT "WarehouseMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
