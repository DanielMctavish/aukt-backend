import { PrismaClient } from "@prisma/client"
import { IProductRepositorie } from "../IProductRepositorie"
import { IProduct } from "../../entities/IProduct"

const prisma = new PrismaClient()

class PrismaProductRepositorie implements IProductRepositorie {

    async create(data: IProduct): Promise<IProduct> {
        const { auct_id, advertiser_id, ...restdata } = data;

        const createdProduct = await prisma.product.create({
            data: {
                ...restdata,
                Auct: {
                    connect: {
                        id: auct_id
                    }
                },
                Advertiser: {
                    connect: {
                        id: advertiser_id
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

        console.log('observando ID PRISMA--> ', id, result);

        return result as IProduct
    }




    async listByAdvertiserId(id: string): Promise<IProduct[]> {
        const products = await prisma.product.findMany({
            where: {
                advertiser_id: id
            },
            include: {
                Advertiser: true,
                Auct: true
            }
        });

        return products.map((product) => product as IProduct);
    }

    async update(data: Partial<IProduct>, id: string): Promise<IProduct | null> {
        const { categorie,
            color,
            cover_img_url,
            height,
            width,
            weight,
            highlight_product,
            description,
            initial_value,
            final_value,
            group_imgs_url,
            title,
        } = data;

        const updatedProduct = await prisma.product.update({
            where: {
                id,
            },
            data: {
                color,
                cover_img_url,
                height,
                width,
                weight,
                highlight_product,
                description,
                initial_value,
                final_value,
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