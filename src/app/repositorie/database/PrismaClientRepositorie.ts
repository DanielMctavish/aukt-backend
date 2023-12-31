import { PrismaClient } from "@prisma/client"
import { IClientRepositorie } from "../IClientRepositorie";
import { IClient } from "../../entities/IClient";

const prisma = new PrismaClient()

class PrismaClientRepositorie implements IClientRepositorie {
    async create(data: IClient): Promise<IClient> {

        return await prisma.client.create({
            data
        })

    }

    async find(client_id: string): Promise<IClient | null> {

        return await prisma.client.findFirst({
            where: {
                id: client_id
            }
        })

    }

    async findByEmail(email: string): Promise<IClient | null> {

        return await prisma.client.findFirst({
            where: {
                email
            }
        })

    }

    async list(): Promise<IClient[]> {

        return await prisma.client.findMany()

    }

    async update(data: Partial<IClient>, client_id: string): Promise<IClient> {

        return await prisma.client.update({
            where: {
                id: client_id
            }, data
        })

    }

    async delete(client_id: string): Promise<IClient | null> {

        return await prisma.client.delete({
            where: {
                id: client_id
            }
        })

    }

}

export default PrismaClientRepositorie;