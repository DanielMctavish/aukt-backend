import { changeAuctStatus, cronmarker } from "../AukCronBot"
import { IBotResponses } from "../interfaces/IBotResponses"
import { intervalProductFloor, falloutInterval } from "./RenderFloor";
import { resumeProductInterval } from "./ResumeRenderAuction"


const PauseAuction = async (auct_id: string): Promise<IBotResponses> => {

    clearInterval(intervalProductFloor);
    clearInterval(falloutInterval);
    clearInterval(resumeProductInterval)
    
    await changeAuctStatus(auct_id, 'paused')


    return new Promise((resolve, reject) => {
        resolve({
            status: 200,
            message: JSON.stringify(cronmarker.allSlots),
            slots: JSON.stringify(cronmarker.allSlots)
        })
    })

}

export default PauseAuction;