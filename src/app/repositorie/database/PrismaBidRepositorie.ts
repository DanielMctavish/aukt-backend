import { PrismaClient } from "@prisma/client";
import IBid from "../../entities/IBid";
import IBidRepositorie from "../IBidRepositorie";
const prisma = new PrismaClient();

class PrismaBidRepositorie implements IBidRepositorie {

    async CreateBid(data: IBid): Promise<IBid> {

        const currentBid = await prisma.bid.create({
            data: {
                value: data.value,
                auct_id: data.auct_id,
                client_id: data.client_id
            }
        })

        return currentBid as IBid

    }

    async FindBid(bid_id: string): Promise<IBid | null> {

        const currentBid = await prisma.bid.findFirst({
            where: {
                id: bid_id
            }
        })

        return currentBid as IBid

    }

    async List(): Promise<IBid[]> {

        const listBid = await prisma.bid.findMany()

        return listBid as IBid[]

    }

    async ListByAuctId(auct_id: string): Promise<IBid[]> {

        const listBid = await prisma.bid.findMany({ where: { auct_id } })

        return listBid as IBid[]

    }
}

export default PrismaBidRepositorie