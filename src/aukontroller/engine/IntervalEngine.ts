import axios from "axios";
import { IAuct } from "../../app/entities/IAuct";
import { FLOOR_STATUS, IFloorStatus } from "../IMainAukController";
import { controllerInstance } from "../../http/http";
import { WinnerEngine } from "../winner-engine/WinnerEngine";

function IntervalEngine(currentAuct: IAuct,
    group: string,
    sokect_message: string,
    resume_count?: number,
    resume_product_id?: string,
    increment?: number): Promise<Partial<IFloorStatus> | null> {

    return new Promise(async (resolve, reject) => {

        if (!currentAuct) return reject(null)
        const allProducts = currentAuct.product_list
        const filteredProducts = allProducts?.filter(product => product.group === group)//filtrando produtos pelo grupo

        if (!filteredProducts) {
            return reject(null)
        }

        let count = resume_count ? resume_count : 0
        let nextProductIndex = 0

        if (resume_product_id) {
            nextProductIndex = filteredProducts.findIndex(product => product.id === resume_product_id)
            if (nextProductIndex === -1) {
                nextProductIndex = 0
            }
        }

        if (filteredProducts[nextProductIndex]) {

            const currentInterval: NodeJS.Timeout = setInterval(async () => {//INTERVAL........................................
                const currentSocket = controllerInstance.auk_sockets.find(socket => socket.auct_id === currentAuct.id)

                const currentProduct = filteredProducts[nextProductIndex]
                if (currentProduct.Winner) { //avaliando se o produto já tem vencedor..........................................
                    clearInterval(currentInterval)
                    return resolve(null)
                }

                if (!filteredProducts[nextProductIndex]) {//ultimo produto detectado
                    clearInterval(currentInterval)
                    return resolve(null)
                }

                if (count >= currentAuct.product_timer_seconds) {
                    if (currentSocket) {
                        currentSocket.product_id = currentProduct.id
                    }

                    await WinnerEngine(currentAuct.id, currentProduct.id).then(() => {
                        nextProductIndex++
                        count = 0
                    })
                }
                //envio de mensagem............................................................................................
                try {
                    await axios.post(`${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${sokect_message}`, {
                        body: {
                            product: currentProduct,
                            auct_id: currentAuct.id
                        },
                        cronTimer: count
                    })
                } catch (error: any) {
                    console.error(error.message)
                }

                if (currentSocket) {
                    currentSocket.timer = count
                }

                count++
            }, 1000)

            //..................................................................................................................
            const currentSocket = controllerInstance.auk_sockets.find(socket => socket.auct_id === currentAuct.id)

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
            reject(null)
        }

    })

}

export default IntervalEngine;