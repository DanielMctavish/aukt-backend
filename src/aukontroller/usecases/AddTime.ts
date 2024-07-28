import { IFloorStatus } from "../IMainAukController";
import { controllerInstance } from "../../http/http";
import { playAuk } from "./PlayAuk";

async function addTime(auct_id: string, time_seconds: number)
    : Promise<Partial<IFloorStatus>> {

    return new Promise((resolve, reject) => {

        const currentSocket = controllerInstance.auk_sockets.find(auct_id => auct_id.auct_id === auct_id)
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
            const increment = currentCount + time_seconds
            clearInterval(currentSocket.interval)
            playAuk(auct_id, currentGroup, increment, currentProductId)
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


export { addTime }