import { controllerInstance } from "../../http/http";
import { IFloorStatus } from "../IMainAukController";
import { playAuk } from "./PlayAuk";


async function resumeAuk(auct_id: string): Promise<Partial<IFloorStatus>> {

    return new Promise((resolve, reject) => {

        const currentAuctionIndex = controllerInstance.auk_sockets.findIndex(socket => socket.auct_id === auct_id)
        if (!currentAuctionIndex) {
            return reject({
                response: {
                    status: 404,
                    body: "auct not found"
                }
            })
        }

        const currentSocket = controllerInstance.auk_sockets.find(auct_id => auct_id.auct_id === auct_id)
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

            const count = currentCount
            clearInterval(currentSocket.interval)
            playAuk(auct_id, currentGroup, count, currentProductId)

        } else {
            reject({
                response: {
                    status: 404,
                    body: "auct not found or not playing"
                }
            })
        }

    })

}


export { resumeAuk }