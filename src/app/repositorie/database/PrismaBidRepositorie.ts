import { PrismaClient } from "@prisma/client";
import IBid from "../../entities/IBid";
import IBidRepositorie from "../IBidRepositorie";
const prisma = new PrismaClient();

class PrismaBidRepositorie implements IBidRepositorie {

    async CreateBid(data: IBid): Promise<IBid> {
        const baseData = {
            value: data.value,
            cover_auto: data.cover_auto !== undefined ? data.cover_auto : undefined,
            Auct: {
                connect: {
                    id: data.auct_id
                }
            },
            Client: {
                connect: {
                    id: data.client_id
                }
            },
            Product: data.product_id ? {
                connect: {
                    id: data.product_id
                }
            } : undefined
        };

        const currentBid = await prisma.bid.create({
            data: baseData,
            include: {
                Product: true,
                Auct: true,
                Client: true
            }
        });

        return currentBid as IBid;
    }

    async FindBid(value: number): Promise<IBid | null> {

        const currentBid = await prisma.bid.findFirst({
            where: {
                value: {
                    gt: value
                }
            }
        })

        return currentBid as IBid
    }

    async List(client_id: string): Promise<IBid[]> {

        const listBid = await prisma.bid.findMany({
            where: {
                client_id: client_id
            }, orderBy: {
                created_at: "desc"
            }, include: {
                Product: true
            }
        })

        return listBid as IBid[]

    }

    async ListByAuctId(auct_id: string): Promise<IBid[]> {

        const listBid = await prisma.bid.findMany({
            where: { auct_id },
            orderBy: { created_at: "desc" }
        })

        return listBid as IBid[]

    }

    async UpdateBid(id: string, data: Partial<IBid>): Promise<IBid> {
        const updatedBid = await prisma.bid.update({
            where: { id },
            data: {
                value: data.value,
                cover_auto: data.cover_auto !== undefined ? data.cover_auto : undefined,
                // Adicione outros campos que você deseja permitir atualizar
            },
        });

        return updatedBid as IBid;
    }
}

export default PrismaBidRepositorie