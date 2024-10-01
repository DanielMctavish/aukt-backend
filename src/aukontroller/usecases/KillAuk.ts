import { controllerInstance } from "../MainAukController";
import { IFloorStatus } from "../IMainAukController";
import PrismaAuctRepositorie from "../../app/repositorie/database/PrismaAuctRepositorie";
import axios from "axios";

const prismaAuct = new PrismaAuctRepositorie();

async function killAuk(auct_id: string): Promise<Partial<IFloorStatus>> {
    return new Promise(async (resolve) => {
        console.log("Received auct_id:", auct_id); // Log para depuração

        const currentAuctionIndex: number = controllerInstance.auk_sockets.findIndex(socket => socket.auct_id === auct_id)
        if (currentAuctionIndex === -1) {
            console.log("Auction not found in auk_sockets"); // Log para depuração
            return resolve({
                response: {
                    status: 404,
                    body: "auct not found"
                }
            })
        }
        clearInterval(controllerInstance.auk_sockets[currentAuctionIndex].interval)



        // Atualiza o status do leilão para "cataloged"
        await prismaAuct.update({ status: "cataloged" }, auct_id);

        //envio de mensagem finalização........................................................................................
        try {
            await axios.post(`${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${auct_id}-auct-finished`, {
                body: {
                    auct_id: auct_id
                }
            })
        } catch (error: any) {
            console.error(error.message)
        }

        controllerInstance.auk_sockets.splice(currentAuctionIndex, 1)

        resolve({
            response: {
                status: 200,
                body: {
                    message: "auct killed and moved to cataloged successfully",
                    auct_id: auct_id
                }
            }
        })
    })
}

export { killAuk }