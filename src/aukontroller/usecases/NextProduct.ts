import { controllerInstance } from "../MainAukController";
import { IFloorStatus } from "../IMainAukController";
import PrismaAuctRepositorie from "../../app/repositorie/database/PrismaAuctRepositorie";
import IntervalEngine from "../engine/IntervalEngine";

const prismaAuct = new PrismaAuctRepositorie()


async function nextProduct(auct_id: string): Promise<Partial<IFloorStatus>> {

    return new Promise(async (resolve) => {

        const currentSocket = controllerInstance.auk_sockets.find((socket: any) => socket.auct_id === auct_id)
        const currentCount = currentSocket?.timer
        const currentProductId = currentSocket?.product_id
        const currentGroup = currentSocket?.group

        if (currentSocket && currentGroup && currentCount) {

            resolve({
                response: {
                    status: 200,
                    body: {
                        message: "auct resumed successfully",
                        auct_id: auct_id
                    }
                }
            })


            clearInterval(currentSocket.interval)
            const currentAuk = await prismaAuct.find(auct_id)
            const sokect_message = `${auct_id}-playing-auction`

            if (currentAuk) {
                const count = currentAuk?.product_timer_seconds
                IntervalEngine(currentAuk, currentGroup, sokect_message, count, currentProductId)
            }

        } else {
            resolve({
                response: {
                    status: 404,
                    body: "auct not found or not playing"
                }
            })
        }

    })

}


export { nextProduct }