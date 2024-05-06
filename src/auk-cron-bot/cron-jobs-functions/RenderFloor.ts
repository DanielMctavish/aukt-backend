import { AuctDateGroups } from "@prisma/client"
import { IAuct } from "../../app/entities/IAuct"
import { IProduct } from "../../app/entities/IProduct"
import { cronmarker } from "../AukCronBot"

const RenderFloor = (floorAuct: IAuct, auctionDate: AuctDateGroups) => {

    const filterProducts = floorAuct.product_list?.filter(product => product.group === auctionDate.group)

    const firstProduct: IProduct | null =
        filterProducts ? filterProducts[0] : null

    console.log("")
    process.stdout.clearLine(0)
    process.stdout.write('PRODUTO: ' + firstProduct?.title)

    cronmarker.currentTimer = floorAuct.product_timer_seconds
    cronmarker.falloutCronos(cronmarker.currentTimer)

    let countFloor = 0
    if (!filterProducts) return false

    const intervalProductFloor = setInterval(() => {
        countFloor++
        const currentProduct = filterProducts[countFloor]

        console.log("")
        process.stdout.clearLine(0);
        process.stdout.write('PRODUTO: ' + currentProduct.title);

        cronmarker.falloutCronos(cronmarker.currentTimer)

        if (countFloor + 1 >= filterProducts?.length) {
            clearInterval(intervalProductFloor)
            setTimeout(() => {
                console.log("")
                console.log("--------------------------------------- GRUPO FINALIZADO ---------------------------------------")
            }, cronmarker.currentTimer * 1000)
        }

    }, cronmarker.currentTimer * 1000)

}

export default RenderFloor;