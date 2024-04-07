import { PrismaClient } from "@prisma/client"
import { ICreditCardRepositorie } from "../ICreditCardRepositorie"
import { ICreditCard } from "../../entities/ICreditCard"

const prisma = new PrismaClient()

class PrismaCreditCardRepositorie implements ICreditCardRepositorie {

    async create(data: ICreditCard): Promise<ICreditCard> {
        const { admin_id, client_id, advertiser_id, ...restData } = data;


        if (client_id) {
            return await prisma.creditCard.create({
                data: {
                    ...restData,
                    Client: {
                        connect: { id: client_id ? client_id : "" }
                    }
                }
            });
        } else if (advertiser_id) {
            return await prisma.creditCard.create({
                data: {
                    ...restData,
                    Advertiser: {
                        connect: { id: advertiser_id ? advertiser_id : "" }
                    }
                }
            });
        }

        return await prisma.creditCard.create({
            data: {
                ...restData,
                Admin: {
                    connect: { id: admin_id ? admin_id : "" }
                }
            }
        });

    }


    async find(id: string): Promise<ICreditCard | null> {
        return await prisma.creditCard.findFirst({ where: { id } })
    }

    async listByAdminID(id: string): Promise<ICreditCard[]> {
        return await prisma.creditCard.findMany({
            where: {
                admin_id: id
            }
        })
    }

    async listByAdvertiserID(id: string): Promise<ICreditCard[]> {
        return await prisma.creditCard.findMany({
            where: {
                advertiser_id: id
            }
        })
    }

    async listByClientID(id: string): Promise<ICreditCard[]> {
        return await prisma.creditCard.findMany({
            where: {
                client_id: id
            }
        })
    }

    async delete(id: string): Promise<ICreditCard | null> {
        return await prisma.creditCard.delete({ where: { id } })
    }
}

export default PrismaCreditCardRepositorie