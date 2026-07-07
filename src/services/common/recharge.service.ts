import {RazorpayService} from "@/services/payment-gateway/razorpay.service";
import {PayuService} from "@/services/payment-gateway/payu.service";
import {CreateRechargeSchema,CreatePaymentSchema,VerifyPaymentSchema} from "@/lib/schema/common/recharge";
import { DB } from "@/lib/db/prisma";
import {CardService} from "@/services/admin/card.service";
import {ExchangeService} from "@/services/common/exchange.service";
import {PaymentMethod, PaymentStatus, Provider} from "@/generated/prisma/enums";
import {randomUUID} from "crypto";
import {nanoid} from 'nanoid'

export class RechargeService{
    private readonly db: DB;

    constructor(db: DB) {
        this.db = db;

    }

    async createRecharge({data,userId}:{data:CreateRechargeSchema,userId:string}) {
        const cardService = new CardService(this.db);
        const exchangeService = new ExchangeService(this.db);
        const card = await cardService.getCard(data.identifier);

        if(!card){
            throw new Error("Card not found");
        }

        const exchange = await exchangeService.getExchange({type:card.type,isActive:true});
        if(!exchange){
            throw new Error("Exchange rate not found");
        }

        const points = (Number(data.amount)*Number(exchange.points))/Number(exchange.amount);
        return this.db.recharge.create({
            data:{
                cardId:card.id,
                rechargeExchangeRateId:exchange.id,
                amount:Number(data.amount),
                points,
                rechargeById:userId,
                shopId:card.shopId
            }
        })
    }

    private async cashMethod(rechargeId:string){
        const cardService = new CardService(this.db);
        const recharge = await this.db.recharge.findUnique({
            where:{
                id:rechargeId
            }
        });
        if(!recharge){
            throw new Error("Recharge not found");
        }

        const payment = await this.db.rechargePayment.create({
            data:{
                paymentMethod:PaymentMethod.CASH,
                orderId:randomUUID(),
                amount:recharge.amount,
                rechargeId,
                status:PaymentStatus.COMPLETED
            }
        })

        await cardService.addPoints({cardId:recharge.cardId,points:Number(recharge.points)})
        return payment
    }

    private async razorpayPayment(rechargeId:string){
        const razorpayService = new RazorpayService();
        const recharge = await this.db.recharge.findUnique({
            where:{
                id:rechargeId
            }
        });
        if(!recharge){
            throw new Error("Recharge not found");
        }

        const order = await razorpayService.createOrder({
            amount:Number(recharge.amount),
            currency:"inr",
            receipt:`rzp_${nanoid(36)}`
        })

        await this.db.rechargePayment.create({
            data:{
                paymentMethod:PaymentMethod.PAYMENT_GATEWAY,
                orderId:order.id,
                amount:recharge.amount,
                rechargeId,

            }
        })

        return order
    }

    private async payuPayment(rechargeId:string){
        const payuService = new PayuService();
        const recharge = await this.db.recharge.findUnique({
            where: {
                id: rechargeId
            },
            include:{
                card:{
                    include:{
                        user:true
                    }
                }
            }
        });
        if(!recharge){
            throw new Error("Recharge not found");
        }

        const order = await payuService.createPayment(
            Number(recharge.amount),
            {
                name:recharge.card.user.name,
                email:recharge.card.user.email,
                productInfo:"recharge"

            }
        )

        await this.db.rechargePayment.create({
            data:{
                paymentMethod:PaymentMethod.PAYMENT_GATEWAY,
                orderId:order.orderId,
                amount:recharge.amount,
                rechargeId,
            }
        })

        return order
    }

    private async razorpayVerify({orderId,paymentId,signature}:{orderId:string,paymentId:string,signature:string}){
        const razorpayService = new RazorpayService()
        const cardService = new CardService(this.db)
        const payment = await this.db.rechargePayment.findFirst({
            where:{
                orderId
            },
            include:{
                recharge:true
            }
        })
        if(!payment){
            throw new Error("Payment not found");
        }

        const isValid = razorpayService.verifyPayment({orderId,paymentId,signature});
        await this.db.rechargePaymentProvider.create({
            data:{
                provider:Provider.RAZORPAY,
                providerPaymentId:paymentId,
                paymentId:payment.id
            }
        })

        if(!isValid){

            return this.db.rechargePayment.update({
                where:{
                    id:payment.id
                },
                data:{
                    status:PaymentStatus.FAILED
                }
            })
        }
        else{
            const updatedPayment = await this.db.rechargePayment.update({
                where:{
                    id:payment.id
                },
                data:{
                    status:PaymentStatus.COMPLETED
                }
            })

            await cardService.addPoints({
                cardId:payment.recharge.cardId,
                points:Number(payment.recharge.points)
            })

            return updatedPayment

        }
    }

    private async payuVerify(orderId:string){
        const payuService = new PayuService()
        const cardService = new CardService(this.db)
        const payment = await this.db.rechargePayment.findFirst({
            where:{
                orderId
            },
            include:{
                recharge:true
            }
        })
        if(!payment){
            throw new Error("Payment not found");
        }

        const verify = await payuService.verifyPayment(orderId);
        await this.db.rechargePaymentProvider.create({
            data:{
                provider:Provider.PAYU,
                providerPaymentId:verify.paymentId,
                paymentId:payment.id
            }
        })

        if(verify.status==='success'){
            const updatedPayment = await this.db.rechargePayment.update({
                where:{
                    id:payment.id
                },
                data:{
                    status:PaymentStatus.COMPLETED
                }
            })

            await cardService.addPoints({
                cardId:payment.recharge.cardId,
                points:Number(payment.recharge.points)
            })

            return updatedPayment

        }
        else{
            return this.db.rechargePayment.update({
                where:{
                    id:payment.id
                },
                data:{
                    status:PaymentStatus.FAILED
                }
            })

        }
    }

    async createPayment(data:CreatePaymentSchema){
        if(data.paymentMethod === PaymentMethod.CASH){
            return this.cashMethod(data.rechargeId);
        }
        else{
            if(data.provider === Provider.RAZORPAY){
                return this.razorpayPayment(data.rechargeId);
            }
            else{
                return this.payuPayment(data.rechargeId);
            }
        }

    }

    async verifyPayment(data:VerifyPaymentSchema){
        if(data.provider === Provider.RAZORPAY){
            if(!data.paymentId || !data.signature){
                throw new Error("Payment ID and signature are required for Razorpay verification");

            }
            return this.razorpayVerify({
                paymentId:data.paymentId,
                orderId:data.orderId,
                signature:data.signature
            })
        }
        else{
            return this.payuVerify(data.orderId);
        }
    }

}