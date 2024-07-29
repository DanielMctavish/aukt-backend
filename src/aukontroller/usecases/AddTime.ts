import { IFloorStatus } from "../IMainAukController";
import { controllerInstance } from "../MainAukController";
import PrismaAuctRepositorie from "../../app/repositorie/database/PrismaAuctRepositorie";
import IntervalEngine from "../engine/IntervalEngine";
const prismaAuct = new PrismaAuctRepositorie()

async function addTime(auct_id: string, time_seconds: number)
    : Promise<Partial<IFloorStatus>> {

    return new Promise(async (resolve) => {

        const currentSocket = controllerInstance.auk_sockets.find(socket => socket.auct_id === auct_id)

        console.log("observando socket -> ", currentSocket)

        const currentCount = currentSocket?.timer
        const currentProductId = currentSocket?.product_id
        const currentGroup = currentSocket?.group

        if (currentSocket && currentGroup && currentCount) {
            resolve({
                response: {
                    status: 200,
                    body: {
                        message: "time added successfully"
                    }
                }
            })
            const increment = currentCount - time_seconds
            clearInterval(currentSocket.interval)

            const currentAuk = await prismaAuct.find(auct_id)
            const sokect_message = `${auct_id}-playing-auction`

            if (currentAuk)
                IntervalEngine(currentAuk, currentGroup, sokect_message, increment, currentProductId)

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


export { addTime }