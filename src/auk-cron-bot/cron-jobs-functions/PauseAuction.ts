import { changeAuctStatus, cronmarker } from "../AukCronBot"
import { IBotResponses } from "../interfaces/IBotResponses"
import { falloutInterval } from "./FalloutCronos"
import { intervalProductFloor } from "./RenderFloor"

const PauseAuction = (auct_id: string): Promise<IBotResponses> => {


    clearInterval(intervalProductFloor)
    clearInterval(falloutInterval)

    changeAuctStatus(auct_id, 'cataloged')

    return new Promise((resolve, reject) => {
        resolve({
            status: 200,
            message: JSON.stringify(cronmarker.allSlots),
            slots: JSON.stringify(cronmarker.allSlots)
        })
    })

}

export default PauseAuction;