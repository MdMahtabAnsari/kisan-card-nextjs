/*
  Warnings:

  - The values [PHONEPE,STRIPE] on the enum `Provider` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[cardType,points,amount]` on the table `RechargeExchangeRate` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Provider_new" AS ENUM ('RAZORPAY', 'PAYU');
ALTER TABLE "RechargePaymentProvider" ALTER COLUMN "provider" TYPE "Provider_new" USING ("provider"::text::"Provider_new");
ALTER TABLE "TransactionPaymentProvider" ALTER COLUMN "provider" TYPE "Provider_new" USING ("provider"::text::"Provider_new");
ALTER TYPE "Provider" RENAME TO "Provider_old";
ALTER TYPE "Provider_new" RENAME TO "Provider";
DROP TYPE "public"."Provider_old";
COMMIT;

-- DropIndex
DROP INDEX "RechargeExchangeRate_cardType_key";

-- AlterTable
ALTER TABLE "RechargeExchangeRate" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "twoFactor" ADD COLUMN     "failedVerificationCount" INTEGER DEFAULT 0,
ADD COLUMN     "lockedUntil" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "RechargeExchangeRate_cardType_points_amount_key" ON "RechargeExchangeRate"("cardType", "points", "amount");
