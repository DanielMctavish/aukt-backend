import axios from "axios";
import PrismaProductRepositorie from "../../app/repositorie/database/PrismaProductRepositorie";
import PrismaAuctRepositorie from "../../app/repositorie/database/PrismaAuctRepositorie";
import { getAukSocket, setAukSocket } from "../engine/EngineSocket";

const prismaProduct = new PrismaProductRepositorie();
const prismaAuk = new PrismaAuctRepositorie();

function WinnerEngine(auct_id: string, product_id: string) {
    const currentSocketAukt = getAukSocket();

    return new Promise(async (resolve) => {
        console.log("Winner started");

        try {
            const currentProduct = await prismaProduct.find({ product_id });
            let currentValue = 0;
            let currentWinner: any = null;

            for (const [index, bid] of currentProduct?.Bid.entries()) {
                if (bid.value > currentValue) {
                    currentValue = bid.value;
                    currentWinner = bid.client_id;
                }
            }

            if (currentWinner) {
                try {
                    const productUpdated = await prismaProduct.update({ winner_id: currentWinner }, product_id);

                    await axios.post(`${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${auct_id}-winner`, {
                        winner: currentWinner,
                        product: productUpdated,
                    });
                } catch (error: any) {
                    throw new Error(error);
                }
            }

        } catch (error: any) {
            console.error(error.message);
            resolve(true);
        }

        setTimeout(async () => {
            console.log("Winner time out!", currentSocketAukt);
            const socket_message = `${auct_id}-playing-auction`;
            const currentAuct = await prismaAuk.find(auct_id);

            if (currentAuct && currentSocketAukt?.group) {
                // Em vez de chamar EngineMaster, vamos apenas atualizar o nextProductIndex
                const nextIndex = (currentSocketAukt.nextProductIndex ?? 0) + 1;
                await setAukSocket({
                    nextProductIndex: nextIndex
                });
                
                // Enviar uma mensagem para indicar que o próximo produto está pronto
                try {
                    await axios.post(`${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${socket_message}`, {
                        body: {
                            auct_id: auct_id,
                            group: currentSocketAukt.group,
                            status: "next_product_ready",
                            nextProductIndex: nextIndex
                        }
                    });
                } catch (error: any) {
                    console.error("Erro ao enviar mensagem de próximo produto:", error.message);
                }
            }

            resolve(true);
        }, 3000);
    });
}

export { WinnerEngine };
