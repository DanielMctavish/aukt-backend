import {  checkAuctionStatus, cronmarker } from "../AukCronBot";
import { IBotResponses } from "../interfaces/IBotResponses";
//import { RenderFloor } from "./RenderFloor";
import StartAuction from "./StartAuction";


const ResumeAuction = async (auct_id: string): Promise<IBotResponses> => {

    const currentAuction = cronmarker.auctions.filter(auction => auction.id === auct_id)

    const slotsAuction = cronmarker.allSlots
    const currentAuctionSlot = slotsAuction.filter(slot => slot.SLOT.auct_id === auct_id)
    const currentAuctionDate = currentAuction[0].auct_dates.filter(date => date.group === currentAuctionSlot[0].SLOT.current_group)


    //RenderFloor(currentAuction[0], currentAuctionDate[0], currentAuctionSlot[0].SLOT.timer_freezed, currentAuctionSlot[0].SLOT.current_product_id)

    const argumentsToResume = {
        currentAuction: currentAuction[0],
        currentAuctionDate: currentAuctionDate[0],
        timer_freezed: currentAuctionSlot[0].SLOT.timer_freezed,
        current_product_id: currentAuctionSlot[0].SLOT.current_product_id
    }

    const currentStatus: string | undefined  = await checkAuctionStatus(auct_id)

    if(currentStatus === 'live'){
        return new Promise((resolve) => {
            resolve({
                status: 500,
                message: 'auction already live',
                slots: JSON.stringify(slotsAuction)
            })
        })
    }

    StartAuction(auct_id, argumentsToResume)

    return new Promise((resolve) => {
        resolve({
            status: 200,
            message: 'auction resumed',
            slots: JSON.stringify(slotsAuction)
        })
    })


}

export default ResumeAuction;