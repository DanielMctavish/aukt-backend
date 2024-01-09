import { PrismaClient } from "@prisma/client"
import { IAdvertiserRepositorie } from "../IAdvertiserRepositorie"
import { IAdvertiser } from "../../entities/IAdvertiser"
import { ICreditCard } from "../../entities/ICreditCard"

const prisma = new PrismaClient()


class PrismaAdvertiserRepositorie implements IAdvertiserRepositorie {

    async create(data: IAdvertiser): Promise<IAdvertiser> {

        const { name,CPF, password, address, email, credit_cards, nickname, url_fake_cover, url_profile_cover } = data

        return await prisma.advertiser.create({
            data: {
                name,
                CPF,
                email,
                password,
                address,
                nickname,
                url_fake_cover,
                url_profile_cover,
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

        const updatedAdvertiser = await prisma.advertiser.update({
            where: {
                id: advertiser_id
            },
            data: {
                name: data.name,
                address: data.address,
                password: data.password,
                email: data.email,
                nickname: data.nickname,
                url_fake_cover: data.url_fake_cover,
                url_profile_cover: data.url_profile_cover
            }
        });

        return updatedAdvertiser
    }

    async delete(advertiser_id: string): Promise<IAdvertiser | null> {
        try {
            console.log('dentro do prisma delete --> ', advertiser_id);
            const deletedAdvertiser = await prisma.advertiser.delete({
                where: {
                    id: advertiser_id
                }
            });

            return deletedAdvertiser;
        } catch (error) {
            // Se o registro não for encontrado, você pode lidar com isso aqui
            console.error(`Erro ao excluir o anunciante com ID ${advertiser_id}:`, error);
            return null;
        }
    }
}

export default PrismaAdvertiserRepositorie