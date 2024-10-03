import { IEngineFloorStatus } from "../IMainAukController";
import PrismaAuctRepositorie from "../../app/repositorie/database/PrismaAuctRepositorie";
import EngineMaster from "../engine/EngineMaster";
import { auk_sockets } from "../engine/EngineSocket";


const prismaAuct = new PrismaAuctRepositorie()


async function nextProduct(auct_id: string): Promise<Partial<IEngineFloorStatus>> {

    return new Promise(async (resolve) => {

        const currentCount = auk_sockets?.timer
        const currentProductId = auk_sockets?.product_id
        const currentGroup = auk_sockets?.group

        if (auk_sockets && currentGroup && currentCount) {

            resolve({
                response: {
                    status: 200,
                    body: {
                        message: "auct resumed successfully",
                        auct_id: auct_id
                    }
                }
            })

            clearInterval(auk_sockets.interval)
            const currentAuk = await prismaAuct.find(auct_id)
            const sokect_message = `${auct_id}-playing-auction`

            if (currentAuk) {
                const count = currentAuk?.product_timer_seconds
                EngineMaster(currentAuk, currentGroup, sokect_message, count, currentProductId)
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