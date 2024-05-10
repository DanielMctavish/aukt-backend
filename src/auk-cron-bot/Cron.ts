import { AuctDateGroups, IAuct } from "../app/entities/IAuct";
import ReceivedAuctions from "./cron-jobs-functions/ReceivedAuctions";
import MarkAuctions from "./cron-jobs-functions/MarkAuctions";
import ValidatePlayFloor from "./cron-jobs-functions/ValidatePlayFloor";
import SlotsStatus from "./cron-jobs-functions/SlotsStatus";
import { RenderFloor } from "./cron-jobs-functions/RenderFloor";
import { FalloutCronos } from "./cron-jobs-functions/FalloutCronos";
import StartAuction from "./cron-jobs-functions/StartAuction";
import PauseAuction from "./cron-jobs-functions/PauseAuction";
import { IBotResponses, IFloorAuction } from "./interfaces/IBotResponses";
import ResumeAuction from "./cron-jobs-functions/ResumeAuction";

class CronMarker {

    public auctions: IAuct[] = []

    public allSlots: any[] = [
        { SLOT: false },
        { SLOT: false },
        { SLOT: false },
        { SLOT: false },
        { SLOT: false },
        { SLOT: false },
        { SLOT: false },
        { SLOT: false },
        { SLOT: false },
        { SLOT: false },
        { SLOT: false },
        { SLOT: false }
    ]

    currentTimer: number = 0

    receivedAuctions(auks: IAuct[]) {
        ReceivedAuctions(auks)
    }

    public markAuctions() {
        MarkAuctions()
    }

    public slotsStatus() {
        return new SlotsStatus()
    }

    public validatePlayFloor(currentTime: Date) {
        ValidatePlayFloor(currentTime)
    }

    public renderFloor(floorAuct: IAuct, auctionDate: AuctDateGroups, timer_freezed?: number, current_product_id?: string) {

        return new Promise((resolve, reject) => {

            RenderFloor(floorAuct, auctionDate, timer_freezed, current_product_id).then(result => {
                resolve('ok')
            })

        })

    }

    public falloutCronos(timerCronos: number, slotInformations: IFloorAuction, timerDelay: number, firstExecution?: boolean) {
        FalloutCronos(timerCronos, slotInformations, timerDelay, firstExecution)
    }

    public startAuction(auct_id: string | any): Promise<IBotResponses> {
        return StartAuction(auct_id)
    }

    public pauseAuction(auct_id: string | any) {

        return PauseAuction(auct_id)

    }

    public resumeAuction(auct_id: string | any): Promise<IBotResponses> {
        return ResumeAuction(auct_id)
    }

    public skipProduct() {



    }

    public changeTime() {



    }

}

export default CronMarker;
