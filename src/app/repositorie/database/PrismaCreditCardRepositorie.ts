import { PrismaClient } from "@prisma/client"
import { ICreditCardRepositorie } from "../ICreditCardRepositorie"
import { ICreditCard } from "../../entities/ICreditCard"

const prisma = new PrismaClient()

class PrismaCreditCardRepositorie implements ICreditCardRepositorie{
    create(data: ICreditCard): Promise<ICreditCard> {
        
    }
    find(id: string): Promise<ICreditCard | null> {
        
    }
    listByAdminID(id: string): Promise<ICreditCard | null> {
        
    }
    listByAdvertiserID(id: string): Promise<ICreditCard | null> {
        
    }
    listByClientID(id: string): Promise<ICreditCard | null> {
        
    }
    delete(id: string): Promise<ICreditCard | null> {
        
    }
}

export default PrismaCreditCardRepositorie