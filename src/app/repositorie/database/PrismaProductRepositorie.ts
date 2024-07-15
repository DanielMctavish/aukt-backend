import { PrismaClient } from "@prisma/client"
import { IProductRepositorie } from "../IProductRepositorie"
import { IProduct } from "../../entities/IProduct"

const prisma = new PrismaClient()

class PrismaProductRepositorie implements IProductRepositorie {

    async create(data: IProduct): Promise<IProduct> {
        const { auct_id, auct_nanoid, advertiser_id, winner_id, ...restdata } = data;

        // Estrutura do tipo esperado pelo Prisma para 'Winner'
        const winnerConnect = winner_id ? { connect: { id: winner_id } } : undefined;

        const dataWinner = {
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
            Winner: winnerConnect // Ajuste para corresponder ao tipo esperado
        }

        const dataDefault = {
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
        }

        const createdProduct = await prisma.product.create({
            data: winner_id ? dataWinner : dataDefault,
            include: {
                Auct: true,
                Advertiser: true,
                Winner: true // Certifique-se de incluir a associação 'Winner'
            }
        });

        return createdProduct as IProduct;
    }

    async find(product_id: string): Promise<IProduct | null> {
        let result;

        if (product_id) {
            result = await prisma.product.findFirst({
                where: {
                    id: product_id
                },
                include: {
                    Advertiser: true,
                    Auct: true,
                    Bid: true,
                    Winner: true
                }
            });
        }

        return result as IProduct
    }

    async findByTitle(title: string): Promise<IProduct[]> {

        const products = await prisma.product.findMany({
            where: {
                title: {
                    contains: title,
                    mode: "insensitive"
                }
            },
            orderBy: {
                created_at: "asc"
            }, take: 3
        });

        return products.map((product) => product as IProduct);

    }

    async list(offset: string): Promise<IProduct[]> {

        const products = await prisma.product.findMany({
            orderBy: {
                created_at: "asc"
            }, take: parseInt(offset)
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

    async update(data: Partial<IProduct>, id: string): Promise<IProduct | null> {
        const { categorie,
            cover_img_url,
            winner_id,
            height,
            width,
            weight,
            highlight_product,
            description,
            initial_value,
            group_imgs_url,
            title,
        } = data;

        const updatedProduct = await prisma.product.update({
            where: {
                id,
            },
            data: {
                cover_img_url,
                winner_id,
                height,
                width,
                weight,
                highlight_product,
                description,
                initial_value,
                group_imgs_url,
                title,
                categorie
            },
            include: {
                Auct: true,
                Advertiser: true,
                Winner: true
            }
        });

        return updatedProduct as IProduct;
    }

    async delete(id: string): Promise<IProduct | null> {
        const deletedProduct = await prisma.product.delete({
            where: { id }
        });

        return deletedProduct as IProduct;
    }


}

export default PrismaProductRepositorie