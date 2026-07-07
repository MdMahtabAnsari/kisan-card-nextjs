-- AlterTable
ALTER TABLE "RechargePayment" ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'PAYMENT_GATEWAY';

-- CreateIndex
CREATE INDEX "RechargePayment_paymentMethod_idx" ON "RechargePayment"("paymentMethod");

-- CreateIndex
CREATE INDEX "TransactionPayment_paymentMethod_idx" ON "TransactionPayment"("paymentMethod");
