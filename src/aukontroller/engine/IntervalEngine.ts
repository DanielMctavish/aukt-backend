import axios from "axios";
import { io } from "socket.io-client";
import PrismaAuctRepositorie from "../../app/repositorie/database/PrismaAuctRepositorie";
import PrismaProductRepositorie from "../../app/repositorie/database/PrismaProductRepositorie";
import PrismaAuctDateRepositorie from "../../app/repositorie/database/PrismaAuctDateRepositorie";
import { AuctStatus, IAuct } from "../../app/entities/IAuct";
import { FLOOR_STATUS, IFloorStatus } from "../IMainAukController";
import { controllerInstance } from "../MainAukController";
import { WinnerEngine } from "../winner-engine/WinnerEngine";
import { addTime } from "../usecases/AddTime";

const prismaAuct = new PrismaAuctRepositorie();
const prismaProduct = new PrismaProductRepositorie();
const prismaAuctDate = new PrismaAuctDateRepositorie();

let nextProductIndex = 0;

const websocketUrl = process.env.WS_WEBSOCKET_CONNECTION;
const socket = io(websocketUrl);

socket.on('connect', () => {
    console.log('Conectado ao servidor Socket.IO');
});

async function IntervalEngine(currentAuct: IAuct,
    group: string,
    sokect_message: string,
    resume_count?: number,
    resume_product_id?: string,
    increment?: number): Promise<Partial<IFloorStatus> | null> {

    return new Promise(async (resolve) => {
        if (!currentAuct) return resolve(null);
        const allProducts = currentAuct.product_list;
        const filteredProducts = allProducts?.filter(product => product.group === group); // Filtrando produtos pelo grupo

        await prismaAuct.update({ status: "live" }, currentAuct.id);

        if (!filteredProducts) {
            return resolve(null);
        }

        // Inicialize count com resume_count se estiver presente, senão comece de 0
        let count = resume_count !== undefined ? resume_count : 0;

        async function findIndexAsync<T>(
            array: T[],
            predicate: (item: T) => Promise<boolean>
        ): Promise<number> {
            for (let i = 0; i < array.length; i++) {
                if (await predicate(array[i])) {
                    return i;
                }
            }
            return -1;
        }

        if (resume_product_id) {
            nextProductIndex = await findIndexAsync(filteredProducts, async (product) => {
                return product.id === resume_product_id;
            }) + 1;
        }

        console.log("product index >>> ", nextProductIndex);

        if (filteredProducts[nextProductIndex]) {
            const currentProduct = filteredProducts[nextProductIndex];
            const productWithBids = await prismaProduct.find({ product_id: currentProduct.id });

            // INTERVAL ########################################################################################################################
            const currentInterval: NodeJS.Timeout = setInterval(async () => {
                const currentInstanceAuk = controllerInstance.auk_sockets.find(socket => socket.auct_id === currentAuct.id);

                if (!filteredProducts[nextProductIndex]) {
                    clearInterval(currentInterval);
                    return resolve(null);
                }

                // Envio de mensagem............................................................................................
                try {
                    await axios.post(`${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${sokect_message}`, {
                        body: {
                            product: productWithBids,
                            auct_id: currentAuct.id
                        },
                        cronTimer: count
                    });
                } catch (error: any) {
                    console.error("Error at try send message: ", error.response);
                }

                // Recebimento de mensagem.......................................................................................
                socket.on(`${currentAuct.id}-bid`, async (data) => {
                    console.log("Lance recebido no intervalEngine: ", data);

                    const timerRemainings = currentAuct.product_timer_seconds - count;
                    if (timerRemainings <= 5) {
                        count -= 3;
                        if (currentInstanceAuk)
                            currentInstanceAuk.timer = count

                    }
                });

                socket.on('disconnect', () => {
                    console.log('Desconectado do servidor Socket.IO');
                });

                //---------------------------------------------------------------------------------------------------------------

                count++;
                if (currentInstanceAuk) {
                    currentInstanceAuk.timer = count;
                } else {
                    controllerInstance.auk_sockets.push({
                        interval: currentInterval,
                        auct_id: currentAuct.id,
                        group: group,
                        timer: 0,
                        status: FLOOR_STATUS.PLAYING
                    });
                }

                if (count >= currentAuct.product_timer_seconds + 1) {
                    clearInterval(currentInterval);
                    if (currentInstanceAuk) {
                        currentInstanceAuk.product_id = currentProduct.id; // Atualiza o produto atual
                    }

                    await WinnerEngine(currentAuct.id, currentProduct.id).then(() => {
                        nextProductIndex++;
                        count = 0; // Reinicia o contador para o próximo produto
                    });
                }

            }, 1000);

            const currentInstanceAuk = controllerInstance.auk_sockets.find(socket => socket.auct_id === currentAuct.id);

            if (currentInstanceAuk) {
                currentInstanceAuk.interval = currentInterval;
                currentInstanceAuk.group = group;
                currentInstanceAuk.status = FLOOR_STATUS.PLAYING;
            }

            resolve({ auct_id: currentAuct.id });

        } else {
            console.log("Fim do leilão!");

            // Atualizando o status do grupo específico
            const groupToUpdate = await prismaAuct.find(currentAuct.id); // Obtenha o leilão atual
            await prismaAuct.update({ status: "cataloged" }, currentAuct.id);

            if (groupToUpdate) {
                const groupDate = groupToUpdate.auct_dates.find(date => date.group === group);
                if (groupDate) {
                    await prismaAuctDate.update({ group_status: "finished" }, groupDate.id);
                }
            }

            // Envio de mensagem de finalização........................................................................................
            try {
                await axios.post(`${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${currentAuct.id}-auct-finished`, {
                    body: {
                        auct_id: currentAuct.id
                    }
                });
            } catch (error: any) {
                console.error(error.message);
            }

            resolve(null);
        }
    });
}


export default IntervalEngine;
