import { PrismaClient } from "@prisma/client";
import IBid from "../../entities/IBid";
import IBidRepositorie from "../IBidRepositorie";
const prisma = new PrismaClient();

class PrismaBidRepositorie implements IBidRepositorie {

    async CreateBid(data: IBid): Promise<IBid> {
        const dataProduct = {
            value: data.value,
            Auct: {
                connect: {
                    id: data.auct_id
                }
            },
            Client: {
                connect: {
                    id: data.client_id
                }
            }
        };

        const currentBid = await prisma.bid.create({
            data: data.product_id ? {
                value: data.value,
                Product: {
                    connect: {
                        id: data.product_id
                    }
                },
                Auct: {
                    connect: {
                        id: data.auct_id
                    }
                },
                Client: {
                    connect: {
                        id: data.client_id
                    }
                }
            } : dataProduct
        });

        return currentBid as IBid;
    }



    async FindBid(bid_id: string): Promise<IBid | null> {

        const currentBid = await prisma.bid.findFirst({
            where: {
                id: bid_id
            }
        })

        return currentBid as IBid

    }

    async List(client_id: string): Promise<IBid[]> {

        const listBid = await prisma.bid.findMany({
            where: {
                client_id: client_id
            }, orderBy: {
                created_at: "asc"
            }, include: {
                Product: true
            }
        })

        return listBid as IBid[]

    }

    async ListByAuctId(auct_id: string): Promise<IBid[]> {

        const listBid = await prisma.bid.findMany({ where: { auct_id } })

        return listBid as IBid[]

    }
}

export default PrismaBidRepositorie