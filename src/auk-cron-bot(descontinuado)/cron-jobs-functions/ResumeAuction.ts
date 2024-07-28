import { checkAuctionStatus, cronmarker } from "../AukCronBot";
import { IBotResponses } from "../interfaces/IBotResponses";
import { ResumeRenderAuction } from "./ResumeRenderAuction";


const ResumeAuction = async (auct_id: string): Promise<IBotResponses> => {
    const currentAuction = cronmarker.auctions.find(auction => auction.id === auct_id)
    currentAuction &&
        ResumeRenderAuction(currentAuction.id)

    const currentStatus: string | undefined = await checkAuctionStatus(auct_id)

    if (currentStatus === 'live') {
        return new Promise((resolve) => {
            resolve({
                status: 500,
                message: 'auction already live'
            })
        })
    }

    return new Promise((resolve) => {
        resolve({
            status: 200,
            message: 'auction resumed'
        })
    })

}

export default ResumeAuction;