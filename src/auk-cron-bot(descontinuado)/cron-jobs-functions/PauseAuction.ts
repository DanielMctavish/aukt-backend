import { changeAuctStatus } from "../AukCronBot"
import { IBotResponses } from "../interfaces/IBotResponses"
import { falloutCronosInstance } from "../Cron"

const PauseAuction = async (auct_id: string): Promise<IBotResponses> => {

    try {
        await falloutCronosInstance.pause(auct_id)
        await changeAuctStatus(auct_id, 'paused')

        return new Promise((resolve, reject) => {
            resolve({
                status: 200,
                message: 'paused',
            })
        })

    } catch (error: any) {
        return new Promise((resolve, reject) => {
            reject({
                status: 500,
                message: error.message
            })
        })
    }

}

export default PauseAuction;