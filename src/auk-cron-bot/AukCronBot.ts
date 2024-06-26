import { AuctStatus, IAuct } from "../app/entities/IAuct"
import PrismaAuctRepositorie from "../app/repositorie/database/PrismaAuctRepositorie"
const prismaAuct = new PrismaAuctRepositorie()
import CronMarker from "./Cron"

const cronmarker = new CronMarker()

const AukCronBot = async (creator_id: string) => {

    let databaseAuct: IAuct[] = []

    const getAuctList = async () => {
        const currentAuct: IAuct[] = await prismaAuct.list(creator_id)
        if (currentAuct.length > databaseAuct.length) {
            databaseAuct = currentAuct
            cronmarker.receivedAuctions(databaseAuct)
        }
    }
    getAuctList()

    const checkinterval = setInterval(async () => { getAuctList() }, 3000)

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