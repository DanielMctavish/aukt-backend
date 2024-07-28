import { FLOOR_STATUS, IFloorStatus } from "../IMainAukController";
import { controllerInstance } from "../../http/http";


async function pauseAuk(auct_id: string): Promise<Partial<IFloorStatus>> {

    return new Promise((resolve, reject) => {

        const currentAuctionSocket = controllerInstance.auk_sockets.find(socket => socket.auct_id === auct_id)
        if (!currentAuctionSocket) {
            return reject({
                response: {
                    status: 404,
                    body: "auct not found"
                }
            })
        }

        clearInterval(currentAuctionSocket.interval)
        currentAuctionSocket.status = FLOOR_STATUS.PAUSED

        resolve({
            response: {
                status: 200,
                body: {
                    message: "auct paused successfully",
                    auct_id: auct_id
                }
            }
        })
        
    })

}


export { pauseAuk }