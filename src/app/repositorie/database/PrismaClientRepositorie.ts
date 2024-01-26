import { PrismaClient } from "@prisma/client"
import { IClientRepositorie } from "../IClientRepositorie";
import { IClient } from "../../entities/IClient";

const prisma = new PrismaClient()

class PrismaClientRepositorie implements IClientRepositorie {
    async create(data: IClient): Promise<IClient> {

        const currentClient = await prisma.client.create({
            data
        })

        return currentClient as IClient
    }

    async find(client_id: string): Promise<IClient | null> {

        const currentClient = await prisma.client.findFirst({
            where: {
                id: client_id
            }
        })

        return currentClient as IClient

    }

    async findByEmail(email: string): Promise<IClient | null> {

        const currentClient = await prisma.client.findFirst({
            where: {
                email
            }
        })

        return currentClient as IClient
    }

    async list(): Promise<IClient[]> {

        const currentClient = await prisma.client.findMany()

        return currentClient as IClient[]
    }

    async update(data: Partial<IClient>, client_id: string): Promise<IClient> {

        const currentClient = await prisma.client.update({
            where: {
                id: client_id
            }, data
        })

        return currentClient as IClient

    }

    async delete(client_id: string): Promise<IClient | null> {

        const currentClient = await prisma.client.delete({
            where: {
                id: client_id
            }
        })

        return currentClient as IClient | null

    }

}

export default PrismaClientRepositorie;