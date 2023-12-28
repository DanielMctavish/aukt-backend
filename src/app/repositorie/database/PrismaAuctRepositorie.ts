import { PrismaClient } from "@prisma/client";
import { IAuctRepositorie } from "../IAuctRepositorie";
import { IAuct } from "../../entities/IAuct";

const prisma = new PrismaClient();

class PrismaAuctRepositorie implements IAuctRepositorie {

    async create(data: IAuct): Promise<IAuct> {
        const { product_list, ...restData } = data;

        const createdAuct = await prisma.auct.create({
            data: {
                ...restData,
                product_list: {
                    create: !product_list ? [] : product_list
                }
            }
        });

        return createdAuct;
    }

    async find(id: string): Promise<IAuct | null> {
        const foundAuct = await prisma.auct.findFirst({
            where: {
                id,
            },
        });
        return foundAuct;
    }

    async list(): Promise<IAuct[]> {
        const aucts = await prisma.auct.findMany();
        return aucts;
    }

    async update(data: Partial<IAuct>, id: string): Promise<IAuct | null> {
        const { product_list, ...restData } = data;

        const updatedAuct = await prisma.auct.update({
            where: {
                id,
            },
            data: {
                ...restData,
                product_list: {
                    upsert: product_list
                        ? product_list.map((product) => ({
                            where: { id: product.id },
                            update: product,
                            create: product,
                        }))
                        : [],
                },
            },
        });

        return updatedAuct;
    }

    async delete(id: string): Promise<IAuct | null> {
        const deletedAuct = await prisma.auct.delete({
            where: {
                id,
            },
        });
        return deletedAuct;
    }
}

export default PrismaAuctRepositorie;
