import { DB } from "@/lib/db/prisma";


export class RechargeService{
    private readonly db:DB;

    constructor(db:DB) {
        this.db = db;
    }

    async getRecharge(id:string){
        return this.db.recharge.findUnique({
            where: {
                id
            },
            include:{
                card:true,
                shop:true,
                rechargeBy:true,
                rechargeExchangeRate:true
            }
        });
    }
}