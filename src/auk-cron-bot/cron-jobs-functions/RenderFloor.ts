import { AuctDateGroups } from "@prisma/client"
import { IAuct } from "../../app/entities/IAuct"
import { IProduct } from "../../app/entities/IProduct"
import { cronmarker } from "../AukCronBot"
import { falloutInterval } from "./FalloutCronos";


let intervalProductFloor: NodeJS.Timeout;
const RenderFloor = (floorAuct: IAuct, auctionDate: AuctDateGroups, timer_freezed?: number, product_id?: string) => {

    return new Promise(async (resolve, reject) => {
        let countProduct = 0
        let timerDelay: number = timer_freezed ? timer_freezed : 0;

        let filterProducts = floorAuct.product_list?.filter(product => product.group === auctionDate.group)

        let firstProduct: IProduct | null =
            filterProducts ? filterProducts[0] : null

        if (product_id && filterProducts) {

            filterProducts.forEach((product, index) => {

                if (product.id === product_id) {
                    firstProduct = product
                    countProduct = index
                }

            })

        }

        //SET SLOT AUCTION .....................................................................

        let slotInformations = {
            auct_id: floorAuct.id,
            auct_title: floorAuct.title,
            current_group: firstProduct ? firstProduct.group : '',
            current_product: firstProduct ? firstProduct.title : '',
            current_product_id: firstProduct ? firstProduct.id : '',
            timer_freezed: 0
        }

        await cronmarker.slotsStatus().selectSlotAvailable(slotInformations)
        await cronmarker.slotsStatus().show()
        //......................................................................................

        console.log("GRUPO: ", auctionDate.group)
        process.stdout.clearLine(0)
        process.stdout.write('PRODUTO: ' + firstProduct?.title)


        clearInterval(falloutInterval)
        cronmarker.currentTimer = floorAuct.product_timer_seconds
        cronmarker.falloutCronos(cronmarker.currentTimer, slotInformations, timerDelay, true)

        //INTERVALO................................................................................................................................
        intervalProductFloor = setInterval(async () => {

            countProduct++
            if (!filterProducts) return false
            const currentProduct = filterProducts[countProduct]

            // set slot................................................................................................

            slotInformations = {
                auct_id: floorAuct.id,
                auct_title: floorAuct.title,
                current_group: currentProduct.group,
                current_product: currentProduct.title,
                current_product_id: currentProduct.id,
                timer_freezed: 0
            }

            await cronmarker.slotsStatus().selectSlotAvailable(slotInformations)
            await cronmarker.slotsStatus().show()

            console.log("")
            process.stdout.clearLine(0);
            process.stdout.write('PRODUTO: ' + currentProduct.title);

            clearInterval(falloutInterval)
            cronmarker.falloutCronos(cronmarker.currentTimer, slotInformations, timerDelay, false)

            if (countProduct + 1 >= filterProducts.length) {

                clearInterval(intervalProductFloor)

                setTimeout(() => {
                    console.log("")
                    console.log("--------------------------------------- GRUPO FINALIZADO ---------------------------------------")
                    resolve(intervalProductFloor)
                }, cronmarker.currentTimer * 1000)

            }

        }, cronmarker.currentTimer * 1000)

    })

}

export { RenderFloor, intervalProductFloor };