import {payuClient} from "@/lib/api/payu.api";
import {createHash} from "node:crypto";
import {randomUUID} from "crypto";
import {unserialize} from "php-serialize";

interface CustomerDetails {
    name: string;
    email: string;
    productInfo: string;
}
interface PayUVerifyPaymentResponse {
    status: string;
    msg: string;
    transaction_details: Record<string, {
        status: string;
        mihpayid: string;
        [key: string]: unknown;
    }>;
}

export class PayuService{
    private readonly key:string|undefined
    private readonly slat:string|undefined
    constructor() {
        this.key = process.env.PAYU_MERCHANT_KEY;
        this.slat = process.env.PAYU_MERCHANT_SALT;
    }

    private generateHash(amount: number, customerDetails: CustomerDetails, orderId: string): string {
        const txnid = orderId;
        const productinfo = customerDetails.productInfo;
        const firstname = customerDetails.name;
        const email = customerDetails.email;
        const udf1 = '';
        const udf2 = '';
        const udf3 = '';
        const udf4 = '';
        const udf5 = '';
        const emptyFields = Array(5).fill('').join('|'); // only 5 empties

        const formattedAmount = Number(amount).toFixed(2); // Ensure two decimal places

        const hashString = `${this.key}|${txnid}|${formattedAmount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}|${emptyFields}|${this.slat}`;

        return createHash("sha512").update(hashString).digest("hex");
    }
    private generateVerifyHash(orderId: string) {
        const command = "verify_payment";
        const hashString = `${this.key}|${command}|${orderId}|${this.slat}`;
        return createHash("sha512").update(hashString).digest("hex");
    }

    async createPayment(amount: number, customerDetails: CustomerDetails) {
            if (!this.key || !this.slat) {
                throw new Error("PayU merchant key or salt is not set");
            }
            const orderId = randomUUID();
            const hash = this.generateHash(amount, customerDetails, orderId);
            return {
                orderId,
                hash,
                customerDetails
            };

    }

    async verifyPayment(orderId: string) {

            if (!this.key || !this.slat) {
                throw new Error("PayU merchant key or salt is not set");
            }
            const verifyHash = this.generateVerifyHash(orderId);
            const response = await payuClient.post('/merchant/postservice', new URLSearchParams({
                key: this.key,
                var1: orderId,
                hash: verifyHash,
                command: 'verify_payment'
            }));
            const data: PayUVerifyPaymentResponse = unserialize(response.data);
            return {
                status: data.transaction_details[orderId]?.status,
                paymentId: data.transaction_details[orderId]?.mihpayid
            }
        }



}