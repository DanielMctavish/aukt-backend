import { AuctDateGroups, IAuct } from "../app/entities/IAuct";
import ReceivedAuctions from "./cron-jobs-functions/ReceivedAuctions";
import MarkAuctions from "./cron-jobs-functions/MarkAuctions";
import ValidatePlayFloor from "./cron-jobs-functions/ValidatePlayFloor";
import { RenderFloor } from "./cron-jobs-functions/RenderFloor";
import { FalloutCronos } from "./cron-jobs-functions/FalloutCronos";
import StartAuction from "./cron-jobs-functions/StartAuction";
import PauseAuction from "./cron-jobs-functions/PauseAuction";
import { IBotResponses, IFloorAuction } from "./interfaces/IBotResponses";
import ResumeAuction from "./cron-jobs-functions/ResumeAuction";
import ChangeTime from "./cron-jobs-functions/ChangeTime";

const falloutCronosInstance = new FalloutCronos()

class CronMarker {
    public auctions: IAuct[] = []


    currentTimer: number = 0

    receivedAuctions(auks: IAuct[]) {
        ReceivedAuctions(auks)
    }

    public markAuctions() {
        MarkAuctions()
    }

    public validatePlayFloor(currentTime: Date) {
        ValidatePlayFloor(currentTime)
    }

    public renderFloor(floorAuct: IAuct, auctionDate: AuctDateGroups) {

        return new Promise((resolve, reject) => {

            RenderFloor(floorAuct, auctionDate).then(result => {
                resolve('ok')
            })

        })

    }

    public startAuction(auct_id: string | any, group: string | any): Promise<IBotResponses> {
        return StartAuction(auct_id, group)
    }

    public pauseAuction(auct_id: string | any) {
        return PauseAuction(auct_id)
    }

    public resumeAuction(auct_id: string | any): Promise<IBotResponses> {
        return ResumeAuction(auct_id)
    }

    public skipProduct() { }

    public changeTime(auct_id: string | any, add: number) {
        return ChangeTime(auct_id, add)
    }

}

export { falloutCronosInstance }
export default CronMarker;
