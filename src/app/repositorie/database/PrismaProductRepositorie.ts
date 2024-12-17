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
            ], take: 70
        });

        return products.map((product) => product as IProduct);

    }

    async list(params: Partial<IParams>): Promise<IProduct[]> {
        try {
            const {
                categorie,
                group,
                auct_id,
                advertiser_id,
                bid_count_order,
                lote_order,
                initial_value_order,
                created_at_order,
                take,
                skip,
                min_initial_value,
                max_initial_value,
                has_winner,
                has_bids,
                highlight_only,
                min_width,
                max_width,
                description_contains,
                created_after,
                created_before,
                categories,
                groups
            } = params;

            let whereFiltered: any = {};

            // Filtros existentes
            
            if (advertiser_id) {
                whereFiltered.advertiser_id = advertiser_id;
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

            // Novos filtros
            if (min_initial_value !== undefined) {
                whereFiltered.initial_value = {
                    ...whereFiltered.initial_value,
                    gte: Number(min_initial_value)
                };
            }
            if (max_initial_value !== undefined) {
                whereFiltered.initial_value = {
                    ...whereFiltered.initial_value,
                    lte: Number(max_initial_value)
                };
            }

            // Filtro de vencedor
            if (has_winner !== undefined) {
                whereFiltered.winner_id = has_winner ? { not: null } : null;
            }

            // Filtro de lances
            if (has_bids !== undefined) {
                whereFiltered.Bid = has_bids ? { some: {} } : { none: {} };
            }

            // Filtro de destaque
            if (highlight_only) {
                whereFiltered.highlight_product = true;
            }

            // Filtros de dimensões
            if (min_width !== undefined) {
                whereFiltered.width = { gte: min_width };
            }
            if (max_width !== undefined) {
                whereFiltered.width = { ...whereFiltered.width, lte: max_width };
            }

            // Filtro de descrição
            if (description_contains) {
                whereFiltered.description = {
                    contains: description_contains,
                    mode: 'insensitive'
                };
            }

            // Filtros de data
            if (created_after) {
                whereFiltered.created_at = {
                    ...whereFiltered.created_at,
                    gte: new Date(created_after)
                };
            }
            if (created_before) {
                whereFiltered.created_at = {
                    ...whereFiltered.created_at,
                    lte: new Date(created_before)
                };
            }

            // Filtros de múltiplos valores
            if (categories?.length) {
                whereFiltered.categorie = { in: categories };
            }
            if (groups?.length) {
                whereFiltered.group = { in: groups };
            }

            // Ordenação
            let orderBy: any = { created_at: 'desc' };

            if (initial_value_order) {
                orderBy = { 
                    initial_value: initial_value_order.toLowerCase()
                };
            } else if (bid_count_order) {
                orderBy = {
                    Bid: {
                        _count: bid_count_order.toLowerCase()
                    }
                };
            } else if (lote_order) {
                orderBy = { 
                    lote: lote_order.toLowerCase() 
                };
            } else if (created_at_order) {
                orderBy = { 
                    created_at: created_at_order.toLowerCase() 
                };
            }

            console.log('Ordenação aplicada:', orderBy);

            const products = await prisma.product.findMany({
                where: whereFiltered,
                orderBy,
                take: take ? parseInt(take) : 12,
                skip: skip ? parseInt(skip) : 0,
                include: {
                    Advertiser: true,
                    Auct: true,
                    Bid: true,
                    Winner: true
                }
            });

            return products.map((product) => product as IProduct);
        } catch (error) {
            console.error("Error in list products:", error);
            throw error;
        }
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