import { FLOOR_STATUS, IFloorStatus } from "../IMainAukController";
import { controllerInstance } from "../MainAukController";
import PrismaAuctRepositorie from "../../app/repositorie/database/PrismaAuctRepositorie";

const prismaAukt = new PrismaAuctRepositorie()


async function pauseAuk(auct_id: string): Promise<Partial<IFloorStatus>> {

    return new Promise(async (resolve) => {
        const currentAuction = await prismaAukt.find(auct_id)

        if (currentAuction?.status === "paused" || currentAuction?.status === "cataloged") {
            return resolve({
                response: {
                    status: 400,
                    body: "auct already paused or cataloged"
                }
            })
        }

        const currentAuctionSocket = controllerInstance.auk_sockets.find(socket => socket.auct_id === auct_id)
        if (!currentAuctionSocket) {
            return resolve({
                response: {
                    status: 404,
                    body: "auct not found or out of memory"
                }
            })
        }

        clearInterval(currentAuctionSocket.interval)
        currentAuctionSocket.status = FLOOR_STATUS.PAUSED
        await prismaAukt.update({ status: "paused" }, auct_id)

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