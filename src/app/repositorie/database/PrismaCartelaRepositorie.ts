import { PrismaClient } from "@prisma/client"
import { ICartelaRepositorie } from "../ICartelaRepositorie";
import { ICartela } from "../../entities/ICartela";

const prisma = new PrismaClient()

class PrismaCartelaRepositorie implements ICartelaRepositorie {

    async create(data: ICartela): Promise<ICartela> {
        const { client_id, advertiser_id, products, ...restData } = data;

        const cartelaData: any = {
            ...restData,
        };

        if (advertiser_id) {
            cartelaData.Advertiser = {
                connect: {
                    id: advertiser_id
                }
            };
        }

        if (client_id) {
            cartelaData.Client = {
                connect: {
                    id: client_id
                }
            };
        }

        if (products && products.length > 0) {
            cartelaData.products = {
                connect: products.map(product => ({
                    id: product.id
                }))
            };
        }

        const result = await prisma.cartela.create({
            data: cartelaData,
        });

        return result as ICartela;
    }



    async find(cartela_id: string): Promise<ICartela | null> {
        const result = await prisma.cartela.findFirst({
            where: {
                id: cartela_id
            }
        })
        return result as ICartela;
    }

    async list(advertiser_id: string, auction_id?: string): Promise<ICartela[]> {
        const whereClause: any = { advertiser_id };
        if (auction_id) {
            whereClause.auction_id = auction_id;
        }

        const result = await prisma.cartela.findMany({
            where: whereClause,
        })
        return result as ICartela[];
    }

    async update(data: Partial<ICartela>, cartela_id: string): Promise<ICartela> {
        const { Advertiser, Client, client_id, advertiser_id, products, ...restData } = data;

        const cartelaData: any = {
            ...restData,
        };

        if (products && products.length > 0) {
            cartelaData.products = {
                create: products.map(product => ({ ...product }))
            };
        }

        const result = await prisma.cartela.update({
            where: {
                id: cartela_id
            },
            data: cartelaData,
        });

        return result as ICartela;
    }

    async delete(cartela_id: string): Promise<ICartela | null> {
        const result = await prisma.cartela.delete({
            where: {
                id: cartela_id
            }
        })
        return result as ICartela;
    }

}

export default PrismaCartelaRepositorie;