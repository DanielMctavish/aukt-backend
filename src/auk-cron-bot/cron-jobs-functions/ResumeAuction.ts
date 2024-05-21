import { checkAuctionStatus, cronmarker } from "../AukCronBot";
import { IBotResponses, IFloorAuction } from "../interfaces/IBotResponses";
import { ResumeRenderAuction } from "./ResumeRenderAuction";


const ResumeAuction = async (auct_id: string): Promise<IBotResponses> => {

    const currentAuction = await cronmarker.auctions.filter(auction => auction.id === auct_id)
    const slotsAuction = await cronmarker.allSlots
    const currentAuctionSlot: IFloorAuction[] = slotsAuction.filter(slot => slot.auct_id === auct_id)
    const currentAuctionDate = currentAuction[0].auct_dates.filter(date => date.group === currentAuctionSlot[0].current_group)

    const argumentsToResume = {
        currentAuction: currentAuction[0],
        currentAuctionDate: currentAuctionDate[0],
        timer_freezed: currentAuctionSlot[0].timer_freezed,
        current_product_id: currentAuctionSlot[0].current_product_id
    }


    ResumeRenderAuction(argumentsToResume.currentAuction, argumentsToResume.currentAuctionDate, argumentsToResume.timer_freezed, argumentsToResume.current_product_id)

    const currentStatus: string | undefined = await checkAuctionStatus(auct_id)

    if (currentStatus === 'live') {
        return new Promise((resolve) => {
            resolve({
                status: 500,
                message: 'auction already live',
                slots: JSON.stringify(slotsAuction)
            })
        })
    }

    return new Promise((resolve) => {
        resolve({
            status: 200,
            message: 'auction resumed',
            slots: JSON.stringify(slotsAuction)
        })
    })

}

export default ResumeAuction;