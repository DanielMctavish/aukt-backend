import { AuctStatus, IAuct } from "../app/entities/IAuct"
import PrismaAuctRepositorie from "../app/repositorie/database/PrismaAuctRepositorie"
const prismaAuct = new PrismaAuctRepositorie()
import CronMarker from "./Cron"

const cronmarker = new CronMarker()

const AukCronBot = async () => {

    let databaseAuct: IAuct[] = []

    const checkinterval = setInterval(async () => {

        const currentAuct: IAuct[] = await prismaAuct.list('clvlh1n3c0000h1wyl0a62ces')

        if (currentAuct.length > databaseAuct.length) {
            databaseAuct = currentAuct
            cronmarker.receivedAuctions(databaseAuct)
        }

    }, 3000)

}

const checkAuctionStatus = async (auct_id: string) => {

    try {

        const currentAuction = await prismaAuct.find(auct_id)
        return currentAuction?.status

    } catch (error) {
        return 'unknown'
    }
}

const changeAuctStatus = async (auct_id: string, status: AuctStatus) => {

    try {
        await prismaAuct.update({ status }, auct_id)
    } catch (error: any) {

        console.log(error.message)

    }

}


export { AukCronBot, cronmarker, checkAuctionStatus, changeAuctStatus };