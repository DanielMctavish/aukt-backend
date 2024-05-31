import { AuctDateGroups } from "@prisma/client"
import { IAuct } from "../../app/entities/IAuct"
import { IProduct } from "../../app/entities/IProduct"
import { checkAuctionStatus, cronmarker } from "../AukCronBot"
import { falloutInterval } from "./FalloutCronos";
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

            await cronmarker.slotsStatus().selectSlotAvailable(slotInformations)
            await cronmarker.slotsStatus().show()

            console.log("GRUPO: ", product.group);
            process.stdout.clearLine(0);
            process.stdout.write('PRODUTO: ' + product?.title);

            clearInterval(falloutInterval);
            cronmarker.currentTimer = floorAuct.product_timer_seconds;
            await cronmarker.falloutCronos(cronmarker.currentTimer, slotInformations);
        }

        console.log("")
        console.log("--------------------------------------- GRUPO FINALIZADO ---------------------------------------")
        //resolve(true)

        resolve(true)

    })

}

export { RenderFloor, intervalProductFloor, falloutInterval };