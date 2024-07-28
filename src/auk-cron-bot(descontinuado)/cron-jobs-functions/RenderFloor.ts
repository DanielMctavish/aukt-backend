import { AuctDateGroups } from "@prisma/client"
import { IAuct } from "../../app/entities/IAuct"
import { falloutCronosInstance } from "../Cron";
import dayjs from "dayjs";


let intervalProductFloor: NodeJS.Timeout;
//let intervalTesting: NodeJS.Timeout;
const RenderFloor = (floorAuct: IAuct, auctionDate: AuctDateGroups) => {

    return new Promise(async (resolve, reject) => {

        if (!auctionDate) {
            resolve(true)
            return false
        }

        let filterProducts = floorAuct.product_list?.filter(product => product.group === auctionDate.group)

        const newOrderProducts = filterProducts?.sort((a, b) => {
            return dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf()
        })

        if (!newOrderProducts) return false
        for (const product of newOrderProducts) {
            //SET SLOT AUCTION .....................................................................

            let slotInformations = {
                auct_id: floorAuct.id,
                auct_title: floorAuct.title,
                current_group: product ? product.group : '',
                current_product: product ? product.title : '',
                current_product_id: product ? product.id : '',
                timer_freezed: 0
            }

            console.log("execução: ", product.title)

            await falloutCronosInstance.start(floorAuct.product_timer_seconds, slotInformations)
            // await cronmarker.falloutCronos(cronmarker.currentTimer, slotInformations);

        }

        const currentInterval = falloutCronosInstance.falloutIntervals
        currentInterval.forEach((item) => [
            clearInterval(item.interval)
        ])

        resolve(true)

    })

}

export { RenderFloor, intervalProductFloor };