import { PrismaClient } from "@prisma/client"
import { IProductRepositorie } from "../IProductRepositorie"
import { IProduct } from "../../entities/IProduct"
import IParams from "../../entities/IParams";

const prisma = new PrismaClient()

class PrismaProductRepositorie implements IProductRepositorie {

    async create(data: IProduct): Promise<IProduct> {
        const { auct_id, auct_nanoid, advertiser_id, winner_id, cartela_id, ...restdata } = data;

        const winnerConnect = winner_id ? { connect: { id: winner_id } } : undefined;
        const cartelaConnect = cartela_id ? { connect: { id: cartela_id } } : undefined;

        let dataWinner = {
            ...restdata,
            auct_nanoid,
            Auct: {
                connect: {
                    id: auct_id,
                    nano_id: auct_nanoid
                }
            },
            Advertiser: {
                connect: {
                    id: advertiser_id
                }
            },
            Winner: winnerConnect,
            Cartela: cartelaConnect
        };

        const dataDefault: any = {
            ...restdata,
            auct_nanoid,
            Auct: {
                connect: {
                    id: auct_id,
                    nano_id: auct_nanoid
                }
            },
            Advertiser: {
                connect: {
                    id: advertiser_id
                }
            }
        };

        if (cartela_id) {
            dataDefault["cartela_id"] = cartela_id;
        }

        const createdProduct = await prisma.product.create({
            data: winner_id ? dataWinner : dataDefault,
            include: {
                Auct: true,
                Advertiser: true,
                Winner: true,  // Certifique-se de incluir a associação 'Winner'
                Cartela: true  // Incluindo a associação 'Cartela' se necessário
            }
        });

        return createdProduct as IProduct;
    }


    async find(params: Partial<IParams>): Promise<IProduct | null> {
        const { categorie, group, auct_id, product_id, lote } = params

        let whereFiltered: any = {};

        if (categorie) {
            whereFiltered.categorie = categorie;
        }

        if (group) {
            whereFiltered.group = group;
        }

        if (auct_id) {
            whereFiltered.auct_id = auct_id;
        }

        if (product_id) {
            whereFiltered.id = product_id;
        }

        if (lote) {
            whereFiltered.lote = parseInt(lote);
        }

        const result = await prisma.product.findFirst({
            where: whereFiltered,
            include: {
                Advertiser: true,
                Auct: true,
                Bid: {
                    include: {
                        Client: true
                    }
                },
                Winner: true
            }
        });

        return result as IProduct
    }



    async findByTitle(title: string): Promise<IProduct[]> {

        console.log("obs param title -> ", title)

        const products = await prisma.product.findMany({
            where: {
                title: {
                    contains: title,
                    mode: "insensitive"
                }
            },
            orderBy: [
                { created_at: "asc" },
                { lote: "asc" },
            ], take: 3
        });

        return products.map((product) => product as IProduct);

    }

    async list(params: Partial<IParams>): Promise<IProduct[]> {

        const { categorie, group, auct_id, bid_count_order, lote_order, initial_value_order, take, skip, creator_id } = params

        let whereFiltered: any = { Winner: null };


        if (creator_id) {
            whereFiltered.advertiser_id = creator_id
        }

        if (categorie) {
            whereFiltered.categorie = categorie;
        }

        if (group) {
            whereFiltered.group = group;
        }

        if (auct_id) {
            whereFiltered.auct_id = auct_id;
        }

        let orderBy: any = undefined;

        if (bid_count_order !== undefined) {
            orderBy = {
                Bid: {
                    _count: bid_count_order.toString() === "true" ? 'desc' : 'asc'
                }
            };
        } else if (lote_order) {
            orderBy = { lote: lote_order };
        } else if (initial_value_order) {
            orderBy = { initial_value: initial_value_order };
        } else {
            orderBy = { created_at: 'desc' };
        }

        const isTake = take ? parseInt(take) : 12

        const products = await prisma.product.findMany({
            where: whereFiltered,
            orderBy: orderBy,
            take: isTake,
            skip: skip ? parseInt(skip) : 0
        });

        return products.map((product) => product as IProduct);
    }



    async listByAdvertiserId(id: string): Promise<IProduct[]> {

        const products = await prisma.product.findMany({
            where: {
                advertiser_id: id
            },
            include: {
                Advertiser: true,
                Auct: true
            },
            orderBy: {
                created_at: "asc"
            }
        });

        return products.map((product) => product as IProduct);
    }

    async listByCategorie(categorie: string): Promise<IProduct[]> {
        const products = await prisma.product.findMany({
            where: {
                categorie: categorie
            },
            include: {
                Advertiser: true,
                Auct: true
            },
            orderBy: {
                created_at: "asc"
            }
        });

        return products.map((product) => product as IProduct);
    }

    async update(data: Partial<IProduct>, product_id: string): Promise<IProduct | null> {
        // Filtrar apenas os campos que têm valores definidos
        const updatedFields = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== undefined)
        );

        const updatedProduct = await prisma.product.update({
            where: {
                id: product_id
            },
            data: updatedFields,  // Usar apenas os campos definidos
            include: {
                Auct: true,
                Advertiser: true,
                Winner: true,
            },
        });

        return updatedProduct as IProduct;
    }


    async delete(id: string): Promise<IProduct | null> {
        const deletedProduct = await prisma.product.delete({
            where: { id }
        });

        return deletedProduct as IProduct;
    }

    async countAllProducts(): Promise<number> {

        const count = await prisma.product.count();

        return count;
    }

    async countAllWithWinners(): Promise<number> {
        const count = await prisma.product.count({
            where: {
                winner_id: {
                    not: null
                }
            }
        });
        return count;
    }
}

export default PrismaProductRepositorie