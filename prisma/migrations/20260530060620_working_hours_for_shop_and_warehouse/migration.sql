/*
  Warnings:

  - You are about to drop the column `closeTime` on the `ShopWorkingHour` table. All the data in the column will be lost.
  - You are about to drop the column `openTime` on the `ShopWorkingHour` table. All the data in the column will be lost.
  - You are about to drop the `ShopWorkingDay` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkingDay` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[shopId,workingHourId]` on the table `ShopWorkingHour` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `endTime` to the `ShopWorkingHour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `ShopWorkingHour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workingHourId` to the `ShopWorkingHour` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WeekDay" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- DropForeignKey
ALTER TABLE "ShopWorkingDay" DROP CONSTRAINT "ShopWorkingDay_shopId_fkey";

-- DropForeignKey
ALTER TABLE "ShopWorkingDay" DROP CONSTRAINT "ShopWorkingDay_workingDayId_fkey";

-- AlterTable
ALTER TABLE "ShopWorkingHour" DROP COLUMN "closeTime",
DROP COLUMN "openTime",
ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "startTime" TEXT NOT NULL,
ADD COLUMN     "workingHourId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ShopWorkingDay";

-- DropTable
DROP TABLE "WorkingDay";

-- CreateTable
CREATE TABLE "WarehouseWorkingHour" (
    "id" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "workingHourId" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WarehouseWorkingHour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkingHour" (
    "id" TEXT NOT NULL,
    "day" "WeekDay" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkingHour_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WarehouseWorkingHour_warehouseId_idx" ON "WarehouseWorkingHour"("warehouseId");

-- CreateIndex
CREATE INDEX "WarehouseWorkingHour_workingHourId_idx" ON "WarehouseWorkingHour"("workingHourId");

-- CreateIndex
CREATE UNIQUE INDEX "WarehouseWorkingHour_warehouseId_workingHourId_key" ON "WarehouseWorkingHour"("warehouseId", "workingHourId");

-- CreateIndex
CREATE INDEX "WorkingHour_day_idx" ON "WorkingHour"("day");

-- CreateIndex
CREATE UNIQUE INDEX "WorkingHour_day_startTime_endTime_key" ON "WorkingHour"("day", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "ShopWorkingHour_workingHourId_idx" ON "ShopWorkingHour"("workingHourId");

-- CreateIndex
CREATE UNIQUE INDEX "ShopWorkingHour_shopId_workingHourId_key" ON "ShopWorkingHour"("shopId", "workingHourId");

-- AddForeignKey
ALTER TABLE "ShopWorkingHour" ADD CONSTRAINT "ShopWorkingHour_workingHourId_fkey" FOREIGN KEY ("workingHourId") REFERENCES "WorkingHour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseWorkingHour" ADD CONSTRAINT "WarehouseWorkingHour_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseWorkingHour" ADD CONSTRAINT "WarehouseWorkingHour_workingHourId_fkey" FOREIGN KEY ("workingHourId") REFERENCES "WorkingHour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
