import { PrismaClient } from "@prisma/client"
import { IProductRepositorie } from "../IProductRepositorie"
import { IProduct } from "../../entities/IProduct"

const prisma = new PrismaClient()

class PrismaProductRepositorie implements IProductRepositorie {

    async create(data: IProduct): Promise<IProduct> {
        const { auct_id, ...restdata } = data;

        const createdProduct = await prisma.product.create({
            data: {
                ...restdata,
                Auct: {
                    connect: {
                        id: auct_id
                    }
                }
            }, include: {
                Auct: true
            }
        });

        return createdProduct as IProduct;
    }


    async find(id: string): Promise<IProduct | null> {
        const result = await prisma.product.findFirst({
            where: { id }
        });

        return result ? (result as IProduct) : null;
    }


    async listByAdvertiserId(id: string): Promise<IProduct[]> {
        const products = await prisma.product.findMany({
            where: {
                owner_id: id
            }
        });

        return products.map((product) => product as IProduct);
    }

    async update(data: Partial<IProduct>, id: string): Promise<IProduct | null> {
        const { auct_id, ...restdata } = data;

        const updatedProduct = await prisma.product.update({
            where: {
                id,
            },
            data: {
                ...restdata,
                Auct: {
                    connect: {
                        id: auct_id
                    }
                },
            },
            include: {
                Auct: true
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