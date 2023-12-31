import { PrismaClient } from "@prisma/client"
import { IProductRepositorie } from "../IProductRepositorie"
import { IProduct } from "../../entities/IProduct"

const prisma = new PrismaClient()

class PrismaProductRepositorie implements IProductRepositorie {

    async create(data: IProduct): Promise<IProduct> {

        const { Auct, ...restdata } = data

        return await prisma.product.create({
            data: {
                ...restdata,
                Auct: {
                    create: Auct
                }
            }
        })
    }

    async find(id: string): Promise<IProduct | null> {
        return await prisma.product.findFirst({
            where: { id }
        })
    }

    async listByAdvertiserId(id: string): Promise<IProduct[]> {
        return await prisma.product.findMany({
            where: {
                owner_id: id
            }
        })
    }

    async update(data: Partial<IProduct>, id: string): Promise<IProduct> {
        const { Auct, ...restdata } = data;
    
        const auctUpdateManyInput = Auct
            ? {
                  updateMany: Auct.map((auct) => ({
                      where: { id: auct.id }, // ou a condição adequada para identificar o auct específico
                      data: auct,
                  })),
              }
            : {};
    
        return await prisma.product.update({
            where: {
                id,
            },
            data: {
                ...restdata,
                Auct: auctUpdateManyInput,
            },
        });
    }
    

    async delete(id: string): Promise<IProduct | null> {
        return await prisma.product.delete({
            where: { id }
        })
    }

}

export default PrismaProductRepositorie