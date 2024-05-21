import { AuctDateGroups, IAuct } from "../../app/entities/IAuct";
import { IProduct } from "../../app/entities/IProduct";
import { changeAuctStatus, cronmarker } from "../AukCronBot";
import { FalloutCronos } from "./FalloutCronos";

// 00 ................................................................................................
const ResumeRenderAuction = async (
    currentAuction: IAuct,
    currentAuctionDate: AuctDateGroups,
    timer_freezed: number,
    current_product_id: string) => {

    console.clear()
    console.log("continuando leilão >>> ................................................................")
    console.log(" __> ", current_product_id)
    await changeAuctStatus(currentAuction.id, "live")

    let currentGroupIndex = 0

    currentAuction.auct_dates.forEach((dates, index) => {
        if (dates.group === currentAuctionDate.group) {
            currentGroupIndex = index
        }
    })

    selectorGroup(currentAuction, currentGroupIndex, current_product_id, currentAuction.product_timer_seconds, timer_freezed)

}
//01................................................................
const selectorGroup = async (Auction: IAuct, groupIndex: number, current_product_id: string, time: number, timeDelay: number) => {
    let targetGroup = false

    for (const [index, date] of Auction.auct_dates.entries()) {

        if (index === groupIndex) {
            targetGroup = true
        }

        if (targetGroup) {
            const productsFilter = Auction.product_list?.filter(product => product.group === date.group)

            if (productsFilter) {

                await filteredProducts(Auction, productsFilter, current_product_id, time, timeDelay).then(() => {
                    console.log("")
                    console.log("GRUPO FINALIZADO (RESUME) ....................................................")
                })

            }
        }

    }

    console.log("LEILÃO FINALIZADO (RESUME) ........................................................")
    await changeAuctStatus(Auction.id, "finished")
}

//02 ................................................................
let firstExecution = true
const filteredProducts = async (Auction: IAuct, products: IProduct[], current_product_id: string, time: number, timeDelay: number) => {

    return new Promise(async (resolve, reject) => {

        let productDelay = 0;

        for (const [index, product] of products.entries()) {

            if (firstExecution && product.id === current_product_id) {
                productDelay = index
                await sendProduct(Auction, product, time, timeDelay)
                firstExecution = false

            } else if (!firstExecution) {
                productDelay++
                await sendProduct(Auction, products[productDelay], time, 0)

            }
        }

        return resolve(true)

    })

}
//03 ................................................................
const sendProduct = async (Auction: IAuct, product: IProduct, time: number, timeDelay: number) => {

    return new Promise(async (resolve) => {

        await renderResumeProduct(Auction, product, time, timeDelay).then(() => resolve(true))

    })

}

//04 ................................................................
let resumeProductInterval: NodeJS.Timeout
const renderResumeProduct = async (Auction: IAuct, product: IProduct, time: number, timeDelay: number) => {

    let timerCount = timeDelay

    return new Promise(async (resolve, reject) => {

        const slotInformations = {
            auct_id: Auction ? Auction.id : "",
            auct_title: Auction ? Auction.title : "",
            current_group: product ? product.group : "",
            current_product: product ? product.title : "",
            current_product_id: product ? product.id : "",
            timer_freezed: timeDelay,
        }

        if (!product) return resolve(true)

        await cronmarker.slotsStatus().selectSlotAvailable(slotInformations)
        await cronmarker.slotsStatus().show()

        console.log("")
        console.log('PRODUTO: ', product.title)
        console.log("GRUPO: ", product.group)

        FalloutCronos(time, slotInformations, timeDelay)

        resumeProductInterval = setInterval(async () => {
            timerCount++

            await cronmarker.slotsStatus().selectSlotAvailable(slotInformations)

            if (timerCount === time) {
                clearInterval(resumeProductInterval)
                resolve(true)
                return
            }

        }, 1000)

    })

}

export { ResumeRenderAuction, resumeProductInterval };