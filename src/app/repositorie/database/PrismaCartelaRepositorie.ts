import { PrismaClient } from "@prisma/client"
import { ICartelaRepositorie } from "../ICartelaRepositorie";
import { ICartela } from "../../entities/ICartela";

const prisma = new PrismaClient()

class PrismaCartelaRepositorie implements ICartelaRepositorie {

    async create(data: ICartela): Promise<ICartela> {
        const { client_id, advertiser_id, auction_id, products, ...restData } = data;

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

        if (auction_id) {
            cartelaData.Auct = {
                connect: {
                    id: auction_id
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

    async list(auction_id: string): Promise<ICartela[]> {
        const whereClause: any = { auction_id };
        if (auction_id) {
            whereClause.auction_id = auction_id;
        }

        const result = await prisma.cartela.findMany({
            where: whereClause,
            include: {
                Client: true,
                Transaction: true,
                products: true
            }
        })
        return result as unknown as ICartela[];
    }

    async listByClient(client_id: string): Promise<ICartela[]> {
        const result = await prisma.cartela.findMany({
            where: {
                client_id: client_id
            },
            include: {
                Client: true,
                Transaction: true,
                products: true
            }
        })
        return result as unknown as ICartela[];
    }

    async update(data: Partial<ICartela>, cartela_id: string): Promise<ICartela> {
        const { Advertiser, tracking_code, Client, client_id, advertiser_id, products, ...restData } = data;

        const cartelaData: any = {
            ...restData,
        };

        if (products && products.length > 0) {
            cartelaData.products = {
                create: products.map(product => ({ ...product }))
            };
        }

        if (tracking_code) {
            cartelaData.tracking_code = tracking_code
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