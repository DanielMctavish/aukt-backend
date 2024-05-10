import { IAuct } from "../../app/entities/IAuct"
import { cronmarker, checkAuctionStatus, changeAuctStatus } from "../AukCronBot"
import { IArgumentsResume, IBotResponses } from "../interfaces/IBotResponses"


const StartAuction = (auct_id: string | any, argumentsToResume?: IArgumentsResume): Promise<IBotResponses> => {

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
        console.log(auctSelected[0].auct_dates[0].group)

        changeAuctStatus(auct_id, 'live')

        resolve({
            status: 200,
            message: 'auction started',
            slots: JSON.stringify(cronmarker.allSlots)
        })

        for (let i = 0; i < auctSelected[0].auct_dates.length; i++) {

            if (argumentsToResume) {
                await cronmarker.renderFloor(
                    argumentsToResume.currentAuction,
                    argumentsToResume.currentAuctionDate,
                    argumentsToResume.timer_freezed,
                    argumentsToResume.current_product_id
                )
            } else {
                for (let i = 0; i < auctSelected[0].auct_dates.length; i++) {
                    await cronmarker.renderFloor(auctSelected[0], auctSelected[0].auct_dates[i])
                }
            }

        }

        console.log(`------------------ LEILÃO FINALIZADO! ${auctSelected[0].title} ----------------------------`)
        changeAuctStatus(auct_id, 'finished')
        cronmarker.allSlots.forEach((slot, index) => {

            if (slot.SLOT.auct_id === auctSelected[0].id) {
                cronmarker.allSlots[index] = { SLOT: false }
            }

        })

    })

}

export default StartAuction;