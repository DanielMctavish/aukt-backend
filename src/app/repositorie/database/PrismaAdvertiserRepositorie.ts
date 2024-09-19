import { PrismaClient } from "@prisma/client"
import { IAdvertiserRepositorie } from "../IAdvertiserRepositorie"
import { IAdvertiser } from "../../entities/IAdvertiser"
import { ICreditCard } from "../../entities/ICreditCard"
import { IAuct } from "../../entities/IAuct"
import { IProduct } from "../../entities/IProduct"
import { IClient } from "../../entities/IClient"

const prisma = new PrismaClient()


class PrismaAdvertiserRepositorie implements IAdvertiserRepositorie {

    async create(data: IAdvertiser): Promise<IAdvertiser> {

        const { credit_cards, Aucts, Products, Clients, amount, ...restData } = data

        const currentAdvertiser = await prisma.advertiser.create({
            data: {
                ...restData,
                amount: 0,
                credit_cards: {
                    connect: credit_cards?.map((card: ICreditCard) => ({
                        id: card.id
                    })) || []
                },
                Aucts: {
                    connect: Aucts?.map((auct: IAuct) => ({
                        id: auct.id
                    })) || []
                },
                Products: {
                    connect: Products?.map((product: IProduct) => ({
                        id: product.id
                    })) || []
                },
                Clients: {
                    connect: Clients?.map((client: IClient) => ({
                        id: client.id
                    })) || []
                }
            }
        })

        return currentAdvertiser as IAdvertiser;
    }

    async find(advertiser_id: string): Promise<IAdvertiser | null> {
        const currentAdvertiser = await prisma.advertiser.findFirst({
            where: {
                id: advertiser_id
            }
        })

        return currentAdvertiser as IAdvertiser
    }

    async findByEmail(email: string): Promise<IAdvertiser | null> {
        const currentAdvertiser = await prisma.advertiser.findFirst({
            where: {
                email
            }, include: {
                Clients: true
            }
        })
        return currentAdvertiser as IAdvertiser
    }

    async update(advertiser_id: string, data: Partial<IAdvertiser>): Promise<IAdvertiser> {
        const {
            CNPJ,
            email,
            CPF,
            address,
            amount,
            company_name,
            company_adress,
            name,
            url_profile_company_logo_cover,
            url_profile_cover,
            password,
            Clients,
        } = data;

        // Se Clients estiver definido, converta-o para a estrutura que o Prisma espera
        const newData = {
            CNPJ,
            email,
            CPF,
            address,
            amount,
            company_name,
            company_adress,
            name,
            url_profile_company_logo_cover,
            url_profile_cover,
            password,
            // Adicione a lógica de Clients
            Clients: Clients
                ? {
                    connect: Clients.map(client => ({ id: client.id })) // Conectando os clientes usando seus IDs
                }
                : undefined,
        };

        const updatedAdvertiser = await prisma.advertiser.update({
            where: {
                id: advertiser_id,
            },
            data: newData,
        });

        return updatedAdvertiser as IAdvertiser;
    }


    async delete(advertiser_id: string): Promise<IAdvertiser | null> {
        try {
            
            const deletedAdvertiser = await prisma.advertiser.delete({
                where: {
                    id: advertiser_id
                }
            });

            return deletedAdvertiser as IAdvertiser;
        } catch (error) {
            // Se o registro não for encontrado, você pode lidar com isso aqui
            console.error(`Erro ao excluir o anunciante com ID ${advertiser_id}:`, error);
            return null;
        }
    }
}

export default PrismaAdvertiserRepositorie