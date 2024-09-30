import axios from "axios";
import PrismaAuctRepositorie from "../../app/repositorie/database/PrismaAuctRepositorie";
import PrismaProductRepositorie from "../../app/repositorie/database/PrismaProductRepositorie";
import PrismaAuctDateRepositorie from "../../app/repositorie/database/PrismaAuctDateRepositorie";
import { AuctStatus, IAuct } from "../../app/entities/IAuct";
import { FLOOR_STATUS, IFloorStatus } from "../IMainAukController";
import { controllerInstance } from "../MainAukController";
import { WinnerEngine } from "../winner-engine/WinnerEngine";
import { addTime } from "../usecases/AddTime";

const prismaAuct = new PrismaAuctRepositorie()
const prismaProduct = new PrismaProductRepositorie()
const prismaAuctDate = new PrismaAuctDateRepositorie()

let nextProductIndex = 0

function IntervalEngine(currentAuct: IAuct,
    group: string,
    sokect_message: string,
    resume_count?: number,
    resume_product_id?: string,
    increment?: number): Promise<Partial<IFloorStatus> | null> {

    // Redefinir o nextProductIndex para 0 ao iniciar um novo leilão
    nextProductIndex = 0; // Adicione esta linha

    return new Promise(async (resolve) => {

        if (!currentAuct) return resolve(null)
        const allProducts = currentAuct.product_list
        const filteredProducts = allProducts?.filter(product => product.group === group)//filtrando produtos pelo grupo

        await prismaAuct.update({ status: "live" }, currentAuct.id)

        if (!filteredProducts) {
            return resolve(null)
        }

        let count = resume_count ? resume_count : 0

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

        console.log("product index >>> ", nextProductIndex)
        const currentSocket = controllerInstance.auk_sockets.find(socket => socket.auct_id === currentAuct.id)

        if (filteredProducts[nextProductIndex]) {
            const currentProduct = filteredProducts[nextProductIndex]
            const productWithBids = await prismaProduct.find({ product_id: currentProduct.id })

            const currentInterval: NodeJS.Timeout = setInterval(async () => {//INTERVAL........................................
                console.log("count -> ", count)

                // if (productWithBids?.Winner) {
                //     console.log('product have a winner...>>> ', productWithBids?.Winner);
                //     clearInterval(currentInterval)
                //     nextProductIndex++
                //     count = 0
                //     currentSocket ?
                //         currentSocket.product_id = currentProduct.id : ""
                //     IntervalEngine(currentAuct, group, sokect_message)
                // }

                if (!filteredProducts[nextProductIndex]) {//ultimo produto detectado
                    clearInterval(currentInterval)
                    return resolve(null)
                }
                //envio de mensagem............................................................................................
                try {
                    await axios.post(`${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${sokect_message}`, {
                        body: {
                            product: productWithBids,
                            auct_id: currentAuct.id
                        },
                        cronTimer: count
                    }).then(() => {
                        console.log("LOTE: ", productWithBids?.lote)
                        console.log("mensagem enviada com sucesso -> ", productWithBids?.title)
                    })
                } catch (error: any) {
                    console.error("error at try send message: ", error.response)
                }
                //recebimento de mensagem.......................................................................................

                const websocketUrl = process.env.API_WEBSOCKET_AUK;

                if (!websocketUrl) {
                    throw new Error('A URL do WebSocket não está definida');
                }

                const socket = new WebSocket(websocketUrl)

                socket.onmessage = async (event) => {
                    const data = JSON.parse(event.data);
                    if (data.message_type === `${currentAuct.id}-bid`) {
                        // Aqui você pode processar o lance recebido
                        console.log("Lance recebido no intervalEngine: ", data);
                        const timerRemainings = currentAuct.product_timer_seconds - count
                        if (timerRemainings <= 3) {
                            await addTime(currentAuct.id, 2)
                        }
                    }
                };
                //---------------------------------------------------------------------------------------------------------------

                if (currentSocket) {
                    currentSocket.timer = count;
                }

                count++

                if (count >= currentAuct.product_timer_seconds + 1) {
                    clearInterval(currentInterval)
                    if (currentSocket) {
                        currentSocket.product_id = currentProduct.id
                    }

                    await WinnerEngine(currentAuct.id, currentProduct.id).then(() => {
                        nextProductIndex++
                        count = 0
                    })
                }

            }, 1000)


            if (!currentSocket) {
                controllerInstance.auk_sockets.push({
                    interval: currentInterval,
                    auct_id: currentAuct.id,
                    group: group,
                    timer: 0,
                    status: FLOOR_STATUS.PLAYING
                })
            } else {
                currentSocket.interval = currentInterval
                currentSocket.group = group
                currentSocket.status = FLOOR_STATUS.PLAYING
            }

            resolve({ auct_id: currentAuct.id })

        } else {

            console.log("Fim do leilão!")

            // Remover o leilão do array auk_sockets
            controllerInstance.auk_sockets = controllerInstance.auk_sockets.filter(socket => socket.auct_id !== currentAuct.id);

            // Atualizando o status do grupo específico
            const groupToUpdate = await prismaAuct.find(currentAuct.id); // Obtenha o leilão atual
            await prismaAuct.update({ status: "cataloged" }, currentAuct.id)


            if (groupToUpdate) {
                const groupDate = groupToUpdate.auct_dates.find(date => date.group === group);

                if (groupDate)
                    await prismaAuctDate.update({ group_status: "finished" }, groupDate.id)

            }

            //envio de mensagem............................................................................................
            try {
                await axios.post(`${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${currentAuct.id}-auct-finished`, {
                    body: {
                        auct_id: currentAuct.id
                    }
                })
            } catch (error: any) {
                console.error(error.message)
            }

            resolve(null)
        }

    })

}


export default IntervalEngine;