import Razorpay from "razorpay"
import {IMap} from "razorpay/dist/types/api";
import { createHmac } from "crypto";


export class RazorpayService{
    private readonly razorpay: Razorpay;

    constructor() {
        if(!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET){
            throw new Error("Razorpay key id or secret is not set");
        }
        this.razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }

    async createOrder({amount, currency, receipt, notes}:{amount: number, currency: string, receipt?: string, notes?: IMap<string|number>}) {

        return this.razorpay.orders.create({
            amount:amount*100,
            currency,
            receipt,
            notes
        });
    }

    verifyPayment({paymentId,orderId,signature}:{paymentId:string,orderId:string,signature:string}){
        const secret = process.env.RAZORPAY_KEY_SECRET;
        if(!secret){
            throw new Error("Razorpay secret key is not set");
        }
        const generatedSignature = createHmac("sha256", secret)
            .update(`${orderId}|${paymentId}`)
            .digest("hex");
        return signature === generatedSignature;
    }
}