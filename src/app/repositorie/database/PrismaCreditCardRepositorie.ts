import { PrismaClient } from "@prisma/client"
import { ICreditCardRepositorie } from "../ICreditCardRepositorie"
import { ICreditCard } from "../../entities/ICreditCard"

const prisma = new PrismaClient()

class PrismaCreditCardRepositorie implements ICreditCardRepositorie{
    async create(data: ICreditCard): Promise<ICreditCard> {
        return await prisma.creditCard.create({data})
    }

    async find(id: string): Promise<ICreditCard | null> {
        return await prisma.creditCard.findFirst({where:{id}})
    }

    async listByAdminID(id: string): Promise<ICreditCard[]> {
        return await prisma.creditCard.findMany({
            where:{
                adminId:id
            }
        })
    }

    async listByAdvertiserID(id: string): Promise<ICreditCard[]> {
        return await prisma.creditCard.findMany({
            where:{
                advertiserId:id
            }
        })
    }

    async listByClientID(id: string): Promise<ICreditCard[]> {
        return await prisma.creditCard.findMany({
            where:{
                clientId:id
            }
        })
    }

    async delete(id: string): Promise<ICreditCard | null> {
        return await prisma.creditCard.delete({where:{id}})
    }
}

export default PrismaCreditCardRepositorie