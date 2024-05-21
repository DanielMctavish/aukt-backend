import { AuctDateGroups } from "@prisma/client"
import { IAuct } from "../../app/entities/IAuct"
import { IProduct } from "../../app/entities/IProduct"
import { checkAuctionStatus, cronmarker } from "../AukCronBot"
import { falloutInterval } from "./FalloutCronos";

let intervalProductFloor: NodeJS.Timeout;
//let intervalTesting: NodeJS.Timeout;
const RenderFloor = (floorAuct: IAuct, auctionDate: AuctDateGroups) => {

    // let count: number = 0
    // return new Promise((resolve) => {

    //     //intervalTesting
    //     intervalTesting = setInterval(() => {
    //         count++;
    //         console.log("rodando intervalo -> ", count)
    //     }, 1000)


    // })

    //TESTING AREA -- TESTING AREA -- TESTING AREA -- TESTING AREA -- TESTING AREA -- TESTING AREA -- TESTING AREA -- TESTING AREA -- 

    return new Promise(async (resolve, reject) => {

        if(!auctionDate){
            resolve(true)
            return false
        }

        let countProduct = 0
        let filterProducts = floorAuct.product_list?.filter(product => product.group === auctionDate.group)
        let firstProduct: IProduct | null =
            filterProducts ? filterProducts[0] : null

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
        cronmarker.falloutCronos(cronmarker.currentTimer, slotInformations)

        //INTERVALO DO GRUPO DOS PRODUTOS.................................................................................................................
        intervalProductFloor = setInterval(async () => {

            countProduct++

            if (!filterProducts) return false
            if (countProduct > filterProducts?.length) {
                clearInterval(intervalProductFloor)
                return false;
            }
            const currentProduct = filterProducts[countProduct]

            if (!currentProduct) {
                clearInterval(intervalProductFloor)
                return false;
            }

            // set slot................................................................................................

            slotInformations = {
                auct_id: floorAuct ? floorAuct.id : '',
                auct_title: floorAuct ? floorAuct.title : '',
                current_group: currentProduct ? currentProduct.group : '',
                current_product: currentProduct ? currentProduct.title : '',
                current_product_id: currentProduct ? currentProduct.id : '',
                timer_freezed: 0
            }

            await cronmarker.slotsStatus().selectSlotAvailable(slotInformations)
            await cronmarker.slotsStatus().show()

            console.log("")
            process.stdout.clearLine(0);
            process.stdout.write('PRODUTO: ' + currentProduct.title);

            clearInterval(falloutInterval)
            cronmarker.falloutCronos(cronmarker.currentTimer, slotInformations)

            const isPaused = await checkAuctionStatus(floorAuct.id)

            if (isPaused === 'paused') {
                clearInterval(intervalProductFloor)
                return
            }

            let finishedInterval = false

            if (countProduct + 1 >= filterProducts.length) {

                clearInterval(intervalProductFloor)

                await new Promise((resolve) => {

                    setTimeout(() => {
                        console.log("")
                        console.log("--------------------------------------- GRUPO FINALIZADO ---------------------------------------")
                        //resolve(true)
                        finishedInterval = true
                        resolve(true)
                    }, cronmarker.currentTimer * 1000)

                })

                if (finishedInterval && isPaused === 'live') {
                    resolve(true)
                }

            }

        }, (cronmarker.currentTimer) * 1000)

    })

}

export { RenderFloor, intervalProductFloor, falloutInterval };