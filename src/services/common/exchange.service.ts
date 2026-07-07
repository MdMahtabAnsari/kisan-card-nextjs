import { DB } from "@/lib/db/prisma";
import {CardTypeWithIsActiveSchema} from "@/lib/schema/common/exchange";

export class ExchangeService {
    private readonly db: DB;

    constructor(db: DB) {
        this.db = db;
    }

    async getExchange({type,isActive}:CardTypeWithIsActiveSchema) {
        return this.db.rechargeExchangeRate.findFirst({
            where:{
                cardType:type,
                isActive
            }
        })
    }





}

