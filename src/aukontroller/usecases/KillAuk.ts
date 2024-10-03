import { IEngineFloorStatus, FLOOR_STATUS } from "../IMainAukController";
import PrismaAuctRepositorie from "../../app/repositorie/database/PrismaAuctRepositorie";
import axios from "axios";
import { getAukSocket, resetAukSockets, setAukSocket } from "../engine/EngineSocket";

const prismaAuct = new PrismaAuctRepositorie();

async function killAuk(auct_id: string): Promise<Partial<IEngineFloorStatus>> {
    return new Promise(async (resolve) => {
        console.log("Received auct_id:", auct_id);

        const currentSocketAuk = getAukSocket();
        clearInterval(currentSocketAuk.interval);

        // Atualiza o status do leilão para COMPLETED
        await setAukSocket({
            status: FLOOR_STATUS.COMPLETED
        });

        await prismaAuct.update({ status: "cataloged" }, auct_id);
        
        try {
            await axios.post(`${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${auct_id}-auct-finished`, {
                body: {
                    auct_id: auct_id
                }
            });
        } catch (error: any) {
            console.error(error.message);
        }

        // Reseta os sockets após enviar a mensagem de finalização
        resetAukSockets();

        resolve({
            response: {
                status: 200,
                body: {
                    message: "auct killed and moved to cataloged successfully",
                    auct_id: auct_id
                }
            }
        });
    });
}

export { killAuk };