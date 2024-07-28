import { changeAuctStatus, cronmarker } from "../AukCronBot"
import { IBotResponses } from "../interfaces/IBotResponses"
import { falloutCronosInstance } from "../Cron"



const ChangeTime = async (auct_id: string, add: number): Promise<IBotResponses> => {

    return new Promise(async (resolve, reject) => {

        if (!auct_id || !add) {
            reject({
                status: 400,
                message: 'auct_id and add are required'
            })
            return
        }

        try {
            const convertedNumber = typeof add !== 'number' ? parseInt(add) : add

            await falloutCronosInstance.changeTime(auct_id, convertedNumber)
            await changeAuctStatus(auct_id, 'paused')


            resolve({
                status: 200,
                message: "time changed successfully"
            })

        } catch (error: any) {
            reject({
                status: 500,
                message: 'error at try change fallout time'
            })
        }

    })

}

export default ChangeTime;