import { controllerInstance } from "../../http/http";
import { IFloorStatus } from "../IMainAukController";


async function killAuk(auct_id: string): Promise<Partial<IFloorStatus>> {

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

        controllerInstance.auk_sockets.slice(currentAuctionIndex, 1)

        resolve({
            response: {
                status: 200,
                body: {
                    message: "auct killed successfully",
                    auct_id: auct_id
                }
            }
        })

    })

}


export { killAuk }