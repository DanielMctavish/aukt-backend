import { changeAuctStatus, cronmarker } from "../AukCronBot"
import { IBotResponses } from "../interfaces/IBotResponses"
import { intervalProductFloor } from "./RenderFloor";
import { resumeProductInterval } from "./ResumeRenderAuction"
import { FalloutCronos } from "./FalloutCronos";


const PauseAuction = async (auct_id: string): Promise<IBotResponses> => {
    const falloutCronos = new FalloutCronos()
    const currentInterval = falloutCronos.falloutIntervals.find(item => item.auct_id === auct_id)

    clearInterval(intervalProductFloor);
    clearInterval(currentInterval?.interval);
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