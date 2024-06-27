import { PrismaClient } from "@prisma/client"
import { IProductRepositorie } from "../IProductRepositorie"
import { IProduct } from "../../entities/IProduct"

const prisma = new PrismaClient()

class PrismaProductRepositorie implements IProductRepositorie {

    async create(data: IProduct): Promise<IProduct> {
        const { auct_id, auct_nanoid, advertiser_id, winner_id, ...restdata } = data;

        const createdProduct = await prisma.product.create({
            data: {
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
                Winner: {
                    connect: {
                        id: winner_id
                    }
                }
            }, include: {
                Auct: true,
                Advertiser: true
            }
        });

        return createdProduct as IProduct;
    }


    async find(id: string): Promise<IProduct | null> {

        const result = await prisma.product.findFirst({
            where: { id },
            include: {
                Advertiser: true,
                Auct: true
            }
        });

        return result as IProduct
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

    async update(data: Partial<IProduct>, id: string): Promise<IProduct | null> {
        const { categorie,
            cover_img_url,
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
                Advertiser: true
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