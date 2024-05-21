import { IAuct } from "../../app/entities/IAuct"
import { cronmarker, checkAuctionStatus, changeAuctStatus } from "../AukCronBot"
import { IBotResponses } from "../interfaces/IBotResponses"

const StartAuction = (auct_id: string | any, group: string): Promise<IBotResponses> => {

    return new Promise(async (resolve, reject) => {

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

        console.clear()
        console.log('--------------------------------------------------------')
        console.log('starting auction... ')

        //filter auction by auct_ID........
        const auctSelected: IAuct[] = cronmarker.auctions.filter(auction => auction.id === auct_id)
        console.log(auctSelected[0].title)

        changeAuctStatus(auct_id, 'live')

        resolve({
            status: 200,
            message: 'auction started',
            slots: JSON.stringify(cronmarker.allSlots)
        })

        let firstExecution = true
        let groupDelay = 0

        for (const date of auctSelected[0].auct_dates) {

            if (groupDelay + 1 === auctSelected[0].auct_dates.length && !firstExecution) return false

            if (date.group === group && firstExecution) {
                await cronmarker.renderFloor(auctSelected[0], auctSelected[0].auct_dates[groupDelay])
                firstExecution = false
                groupDelay++
            }

            if (!firstExecution) {
                await cronmarker.renderFloor(auctSelected[0], auctSelected[0].auct_dates[groupDelay])
            }

            groupDelay++
        }

        //se leilão estiver "paused" nada fazer...........................................................

        const isPaused = await checkAuctionStatus(auctSelected[0].id)
        if (isPaused === 'paused') return false

        console.log(`------------------ LEILÃO FINALIZADO! ${auctSelected[0].title} ----------------------------`)
        changeAuctStatus(auct_id, 'finished')

        // esvaziando o slot do leilão em questão................................................................
        cronmarker.allSlots.forEach((slot, index) => {

            if (slot.auct_id === auctSelected[0].id) {
                cronmarker.allSlots[index] = false
            }

        })


    })

}

export default StartAuction;