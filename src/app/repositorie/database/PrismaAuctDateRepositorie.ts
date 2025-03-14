import { PrismaClient } from "@prisma/client"
import { AuctDateGroups } from "../../entities/IAuct"

const prisma = new PrismaClient()


class PrismaAuctDateRepositorie {

    async update(data: Partial<AuctDateGroups>, auct_Date_id: string): Promise<AuctDateGroups> {

        const updatedGroupDate = await prisma.auctDateGroups.update({
            where: {
                id: auct_Date_id
            },
            data
        })

        return updatedGroupDate as AuctDateGroups
    }

    async deleteMany(auct_id: string): Promise<void> {
        await prisma.auctDateGroups.deleteMany({
            where: {
                auctId: auct_id
            }
        })
    }

}

export default PrismaAuctDateRepositorie;
