import axios from "axios"
import PrismaProductRepositorie from "../../app/repositorie/database/PrismaProductRepositorie"
import PrismaAuctRepositorie from "../../app/repositorie/database/PrismaAuctRepositorie"
import { controllerInstance } from "../MainAukController"
import IntervalEngine from "../engine/IntervalEngine"

const prismaProduct = new PrismaProductRepositorie()
const prismaAuk = new PrismaAuctRepositorie()

function WinnerEngine(auct_id: string, product_id: string) {

    return new Promise(async (resolve) => {
        console.log("winner started")

        try {
            const currentProduct = await prismaProduct.find({product_id})
            let currentValue = 0
            let currentWinner: any = null

            for (const [index, bid] of currentProduct?.Bid.entries()) {
                if (bid.value > currentValue) {
                    currentValue = bid.value
                    currentWinner = bid.client_id
                }
            }

            if (currentWinner) {
                try {
                    const productUpdated = await prismaProduct.update({ winner_id: currentWinner }, product_id)

                    await axios.post(`${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${auct_id}-winner`, {
                        winner: currentWinner,
                        product: productUpdated,
                    })
                } catch (error: any) {
                    throw new Error(error)
                }
            }

        } catch (error: any) {
            console.error(error.message)
            resolve(true)
        }

        setTimeout(async () => {
            const currentSocket = controllerInstance.auk_sockets.find(socket => socket.auct_id === auct_id)

            console.log("winner time out!", currentSocket)
            const sokect_message = `${auct_id}-playing-auction`
            const currentAuct = await prismaAuk.find(auct_id)

            if (currentAuct && currentSocket?.group)
                IntervalEngine(currentAuct, currentSocket.group, sokect_message, 0, currentSocket?.product_id)

            resolve(true)
        }, 3000);

    })

}

export { WinnerEngine }