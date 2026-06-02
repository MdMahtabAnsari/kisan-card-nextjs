/*
  Warnings:

  - You are about to drop the `ShopCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Shop" DROP CONSTRAINT "Shop_categoryId_fkey";

-- DropTable
DROP TABLE "ShopCategory";

-- AddForeignKey
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
