import { IAuct } from "../../app/entities/IAuct";
import { changeAuctStatus, cronmarker } from "../AukCronBot";
import { falloutCronosInstance } from "../Cron";


// 00 ................................................................................................
const ResumeRenderAuction = async (auct_id: string) => {

    await changeAuctStatus(auct_id, "live")
    await falloutCronosInstance.resume(auct_id)

}


export { ResumeRenderAuction };