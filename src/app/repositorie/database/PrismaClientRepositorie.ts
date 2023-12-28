import { PrismaClient } from "@prisma/client"
import { IClientRepositorie } from "../IClientRepositorie";
import { IClient } from "../../entities/IClient";

const prisma = new PrismaClient()

class PrismaClientRepositorie implements IClientRepositorie{
    async create(data: IClient): Promise<IClient> {
        
    }
    async find(client_id: string): Promise<IClient | null> {
        
    }
    async findByEmail(email: string): Promise<IClient | null> {
        
    }
    async update(data: Partial<IClient>, client_id: string): Promise<IClient> {
        
    }
    async delete(client_id: string): Promise<IClient | null> {
        
    }
}

export default PrismaClientRepositorie;