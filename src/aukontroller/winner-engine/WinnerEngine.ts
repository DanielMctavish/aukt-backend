import axios from "axios"
import PrismaProductRepositorie from "../../app/repositorie/database/PrismaProductRepositorie"
const prismaProduct = new PrismaProductRepositorie()

function WinnerEngine(auct_id: string, product_id: string) {

    return new Promise(async (resolve, reject) => {
        console.log("winner started")

        try {
            const currentProduct = await prismaProduct.find(product_id)
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
            reject(error)
        }

        setTimeout(() => {
            console.log("winner time out!")
            resolve(true)
        }, 3000);

    })

}

export { WinnerEngine }