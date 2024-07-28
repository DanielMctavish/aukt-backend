import { IAuct } from "../../app/entities/IAuct"
import { cronmarker, checkAuctionStatus, changeAuctStatus, AukCronBot } from "../AukCronBot"
import { IBotResponses } from "../interfaces/IBotResponses"
import PrismaAuctRepositorie from "../../app/repositorie/database/PrismaAuctRepositorie"

const prismaAuct = new PrismaAuctRepositorie()

const StartAuction = (auct_id: string | any, group: string): Promise<IBotResponses> => {

    return new Promise(async (resolve, reject) => {

        const currentAuct = await prismaAuct.find(auct_id)
        currentAuct?.advertiser_id && AukCronBot(currentAuct.advertiser_id)

        //checkauctstatus...............
        const currentStatus: string | undefined = await checkAuctionStatus(auct_id)

        if (!currentStatus) {
            reject({
                status: 500,
                message: 'auction not found',
            })
            console.log('auction not found')
            return
        }

        if (currentStatus === 'live') {
            reject({
                status: 500,
                message: 'auction already started',
            })
            return
        }

        if (currentStatus === 'finished') {
            reject({
                status: 500,
                message: 'auction already finished',
            })
            console.log('auction already finished')
            return
        }

        //filter auction by auct_ID........
        const auctSelected: IAuct[] = cronmarker.auctions.filter(auction => auction.id === auct_id)

        if (!auctSelected[0]) {
            reject({
                status: 500,
                message: 'auction not found or data at passed',
            })
            console.log('auction not found')
            return
        }

        changeAuctStatus(auct_id, 'live')

        resolve({
            status: 200,
            message: 'auction started'
        })

        const filteredGroup = auctSelected[0].auct_dates.filter(date => date.group === group)
        await cronmarker.renderFloor(auctSelected[0], filteredGroup[0])

        //se leilão estiver "paused" nada fazer...........................................................

        const isPaused = await checkAuctionStatus(auctSelected[0].id)
        if (isPaused === 'paused') return false

        console.log(`------------------ LEILÃO FINALIZADO! ${auctSelected[0].title} ----------------------------`)
        changeAuctStatus(auct_id, 'finished')


    })

}

export default StartAuction;