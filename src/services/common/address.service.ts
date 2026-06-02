import { DB } from "@/lib/db/prisma";
import { AddressSchema } from "@/lib/schema/common/address";

export class AddressService {
    private readonly db: DB;

    constructor(db: DB) {
        this.db = db;
    }


    async createAddress(data: AddressSchema) {
        return this.db.address.create({
            data,
        });
    }

    async createUserAddress(userId: string, addressId: string) {
        return this.db.userAddress.create({
            data: {
                userId,
                addressId,
            },
        });
    }


}

