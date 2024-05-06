import { AuctDateGroups, IAuct } from "../app/entities/IAuct";
import dayjs from "dayjs"
import { IProduct } from "../app/entities/IProduct";
import ReceivedAuctions from "./cron-jobs-functions/ReceivedAuctions";
import MarkAuctions from "./cron-jobs-functions/MarkAuctions";
import ValidatePlayFloor from "./cron-jobs-functions/ValidatePlayFloor";
import SlotsStatus from "./cron-jobs-functions/SlotsStatus";
import RenderFloor from "./cron-jobs-functions/RenderFloor";
import FalloutCronos from "./cron-jobs-functions/FalloutCronos";
import StartAuction from "./cron-jobs-functions/StartAuction";

class CronMarker {

    public auctions: IAuct[] = []

    slotAuct01: IAuct | null = null
    slotAuct02: IAuct | null = null
    slotAuct03: IAuct | null = null
    slotAuct04: IAuct | null = null
    slotAuct05: IAuct | null = null
    slotAuct06: IAuct | null = null

    currentTimer: number = 0

    receivedAuctions(auks: IAuct[]) {
        ReceivedAuctions(auks)
    }

    public markAuctions() {
        MarkAuctions()
    }

    public slotsStatus() {
        SlotsStatus()
    }

    public validatePlayFloor(currentTime: Date) {
        ValidatePlayFloor(currentTime)
    }

    public renderFloor(floorAuct: IAuct, auctionDate: AuctDateGroups) {
        RenderFloor(floorAuct, auctionDate)
    }

    public falloutCronos(timerCronos: number) {
        FalloutCronos(timerCronos)
    }

    public startAuction(auct_id: string | any) {
        StartAuction(auct_id)
    }

    public pauseAuction() {



    }

    public skipProduct() {



    }

    public changeTime() {



    }

}

export default CronMarker;
