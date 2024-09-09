import axios from "axios";
import PrismaAuctRepositorie from "../../app/repositorie/database/PrismaAuctRepositorie";
import PrismaProductRepositorie from "../../app/repositorie/database/PrismaProductRepositorie";
import { IAuct } from "../../app/entities/IAuct";
import { FLOOR_STATUS, IFloorStatus } from "../IMainAukController";
import { controllerInstance } from "../MainAukController";
import { WinnerEngine } from "../winner-engine/WinnerEngine";

const prismaAuct = new PrismaAuctRepositorie()
const prismaProduct = new PrismaProductRepositorie()

function IntervalEngine(currentAuct: IAuct,
    group: string,
    sokect_message: string,
    resume_count?: number,
    resume_product_id?: string,
    increment?: number): Promise<Partial<IFloorStatus> | null> {

    return new Promise(async (resolve) => {

        if (!currentAuct) return resolve(null)
        const allProducts = currentAuct.product_list
        const filteredProducts = allProducts?.filter(product => product.group === group)//filtrando produtos pelo grupo

        await prismaAuct.update({ status: "live" }, currentAuct.id)

        if (!filteredProducts) {
            return resolve(null)
        }

        let count = resume_count ? resume_count : 0
        let nextProductIndex = 0

        if (resume_product_id) {
            nextProductIndex = filteredProducts.findIndex(product => product.id === resume_product_id) + 1

            if (nextProductIndex === -1) {
                nextProductIndex = 0
            }
        }

        if (filteredProducts[nextProductIndex]) {
            const currentProduct = filteredProducts[nextProductIndex]
            const productWithBids = await prismaProduct.find({ product_id: currentProduct.id })

            const currentInterval: NodeJS.Timeout = setInterval(async () => {//INTERVAL........................................
                const currentSocket = controllerInstance.auk_sockets.find(socket => socket.auct_id === currentAuct.id)

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
                        console.log("mensagem enviada com sucesso -> ", productWithBids?.title)
                    })
                } catch (error: any) {
                    console.error("error at try send message: ", error.response)
                }

                if (currentSocket) {
                    currentSocket.timer = count
                }

                count++

                if (count >= currentAuct.product_timer_seconds) {
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
            // FIM DO LEILÃO! Futura mensagem de finalização poderá ser escrita ou chamada aqui
            console.log("Fim do leilão!")

            // const productNotWinner = currentAuct.product_list?.filter(product => !product.Winner)

            // if (productNotWinner && productNotWinner.length > 10) {
            //     const separateTitle = currentAuct.title.split("_")


            //     if (separateTitle[1]) {
            //         let currentTitleVersion = parseInt(separateTitle[1], 10)
            //         prismaAuct.create({
            //             ...currentAuct,
            //             title: currentAuct.title + '_' + currentTitleVersion++,
            //             status: 'cataloged',
            //             product_list: productNotWinner
            //         })
            //     } else {
            //         prismaAuct.create({
            //             ...currentAuct,
            //             title: currentAuct.title + '_2',
            //             status: 'cataloged',
            //             product_list: productNotWinner
            //         })
            //     }

            // }

            await prismaAuct.update({ status: "finished" }, currentAuct.id)
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