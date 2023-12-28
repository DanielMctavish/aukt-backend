import { PrismaClient } from "@prisma/client"
import { IAdvertiserRepositorie } from "../IAdvertiserRepositorie"
import { IAdvertiser } from "../../entities/IAdvertiser"
import { ICreditCard } from "../../entities/ICreditCard"

const prisma = new PrismaClient()


class PrismaAdvertiserRepositorie implements IAdvertiserRepositorie {

    async create(data: IAdvertiser): Promise<IAdvertiser> {

        const { name, password, address, email, credit_cards } = data

        return await prisma.advertiser.create({
            data: {
                name,
                email,
                password,
                address,
                credit_cards: {
                    connect: credit_cards?.map((card: ICreditCard) => ({
                        id: card.id
                    })) || []
                }
            }
        })
    }

    async find(advertiser_id: string): Promise<IAdvertiser | null> {
        return await prisma.advertiser.findFirst({
            where: {
                id: advertiser_id
            }
        })
    }

    async findByEmail(email: string): Promise<IAdvertiser | null> {
        return await prisma.advertiser.findFirst({
            where: {
                email
            }
        })
    }

    async update(advertiser_id: string, data: Partial<IAdvertiser>): Promise<IAdvertiser> {
        const { credit_cards, ...restData } = data;

        const updatedAdvertiser = await prisma.admin.update({
            where: {
                id: advertiser_id
            },
            data: {
                ...restData,
                credit_cards: {
                    connect: credit_cards?.map((card: ICreditCard) => ({
                        id: card.id
                    })) || []
                }
            }
        });

        return updatedAdvertiser
    }

    async delete(advertiser_id: string): Promise<IAdvertiser | null> {
        return await prisma.advertiser.delete({
            where: {
                id: advertiser_id
            }
        })
    }
}

export default PrismaAdvertiserRepositorie