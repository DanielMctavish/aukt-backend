import axios from "axios";
import { IFloorAuction } from "../interfaces/IBotResponses";
import { cronmarker } from "../AukCronBot";

import { WinnerTimer } from "./WinnerTimer";
import PrismaProductRepositorie from "../../app/repositorie/database/PrismaProductRepositorie";
import PrismaAuctRepositorie from "../../app/repositorie/database/PrismaAuctRepositorie";

const prismaProduct = new PrismaProductRepositorie()
const prismaAuct = new PrismaAuctRepositorie()


interface IFalloutInterval {
    timerCronos?: number | any //tempo total de um lote
    slotInformations?: IFloorAuction;
    auct_id: string
    product_id: string
    interval?: NodeJS.Timeout
    currentCount?: number | any //tempo contando a partir do 0
}


class FalloutCronos {
    public falloutIntervals: IFalloutInterval[] = []
    private falloutPausedIntervals: IFalloutInterval[] = []

    public start(timerCronos: number,
        slotInformations: IFloorAuction,
        timerDelay?: number) {
        return new Promise(async (resolve) => {

            // CONTADOR E BARRA DE PROGRESSO..............................................
            let count = 1

            if (timerDelay && timerDelay > 0) {
                count = timerDelay
            }

            try {
                //MENSAGEIRO................................
                await axios.post(`${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${slotInformations.auct_id}`, {
                    body: slotInformations,
                    cronTimer: count
                })
            } catch (error: any) {
                console.error(error.message)
            }

            this.falloutIntervals.push({
                timerCronos: timerCronos,
                slotInformations: slotInformations,
                auct_id: slotInformations.auct_id,
                product_id: slotInformations.current_product_id,
                interval: setInterval(async () => {

                    count++;

                    //MENSAGEIRO DENTRO DO INTERVALO................................
                    try {
                        await axios.post(`${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${slotInformations.auct_id}`, {
                            body: slotInformations,
                            cronTimer: count
                        })
                    } catch (error: any) {
                        console.error(error.message)
                    }

                    const currentFallout = this.falloutIntervals.find(i => i.auct_id === slotInformations.auct_id)
                    if (currentFallout) currentFallout.currentCount = count

                    //finalização do leilão................................................................................................
                    if (count >= timerCronos) {
                        const currentInterval = this.falloutIntervals.find((item: any) => item.auct_id === slotInformations.auct_id)

                        clearInterval(currentInterval?.interval);

                        //Identificar e determinar o vencedor................................................................
                        try {

                            const currentProduct = await prismaProduct.find(slotInformations.current_product_id)
                            let currentValue = 0
                            let currentWinner: any = null

                            for (const [index, bid] of currentProduct?.Bid.entries()) {
                                if (bid.value > currentValue) {
                                    currentValue = bid.value
                                    currentWinner = bid.client_id
                                }
                            }

                            if (currentWinner) {
                                try {
                                    const productUpdated = await prismaProduct.update({ winner_id: currentWinner },
                                        slotInformations.current_product_id)

                                    await axios.post(`${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${slotInformations.auct_id}-winner`, {
                                        winner: currentWinner,
                                        product: productUpdated,
                                        cronTimer: count
                                    })
                                } catch (error: any) {
                                    throw new Error(error)
                                }
                            }

                            await WinnerTimer()
                            count = 0
                            resolve(true);

                        } catch (error: any) {
                            console.log("err at try register winner ", error.message)
                        }
                    }

                }, 1000)
            })

        })
    }

    public async pause(auct_id: string) {
        return new Promise(async (resolve, reject) => {
            const currentFallout = this.falloutIntervals.find(i => i.auct_id === auct_id)
            const index = this.falloutIntervals.findIndex(item => item.auct_id === auct_id);

            if (index !== -1) {
                const getCurrentFallout = this.falloutIntervals[index];
                clearInterval(getCurrentFallout.interval);

                try {
                    await axios.post(`${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${getCurrentFallout.auct_id}`, {
                        body: getCurrentFallout.slotInformations,
                        cronTimer: getCurrentFallout.currentCount
                    })
                } catch (error: any) {
                    console.error(error.message)
                }

                // Store slotInformations along with other properties
                this.falloutPausedIntervals.push({
                    timerCronos: getCurrentFallout.timerCronos,
                    slotInformations: getCurrentFallout.slotInformations,
                    auct_id: getCurrentFallout.auct_id,
                    product_id: getCurrentFallout.product_id,
                    currentCount: getCurrentFallout.currentCount
                });

                this.falloutIntervals.splice(index, 1);
            }

            resolve(true);
        });
    }



    public resume(auct_id: string) {
        return new Promise(async (resolve, reject) => {
            const getCurrentFallout = this.falloutPausedIntervals.find(item => item.auct_id === auct_id)

            if (!getCurrentFallout?.auct_id) return false

            const currentAuct = await prismaAuct.find(auct_id)
            const allProducts = currentAuct?.product_list
            let filteredProducts = allProducts?.filter(product => product.group === getCurrentFallout.slotInformations?.current_group)
            if (!filteredProducts || !currentAuct) return false

            let firstResume = false

            for (const product of filteredProducts) {
                if (product.id !== getCurrentFallout.product_id && !firstResume) continue

                this.start(getCurrentFallout.timerCronos,
                    {
                        auct_id: auct_id,
                        auct_title: currentAuct.title,
                        current_product: product.title,
                        current_product_id: product.id,
                        timer_freezed: getCurrentFallout.currentCount,
                        current_group: product.group
                    }, // Ensure slotInformations is passed correctly
                    !firstResume ? getCurrentFallout.currentCount : 0
                )

                firstResume = true
            }

            resolve(true)
        })
    }


    public changeTime(auct_id: string, addTime: number) {

        return new Promise(async (resolve, reject) => {
            const index = this.falloutIntervals.findIndex(item => item.auct_id === auct_id);

            if (index !== -1) {
                const getCurrentFallout = this.falloutIntervals[index];
                const getCurrentCount = this.falloutIntervals[index].currentCount


                clearInterval(getCurrentFallout.interval);
                this.falloutIntervals.splice(index, 1);

                const timeAdded = getCurrentFallout.timerCronos + addTime
                if (!getCurrentFallout.slotInformations) return false
                this.start(timeAdded,
                    getCurrentFallout.slotInformations,
                    getCurrentCount
                )
            }

            resolve(true);

        })

    }
}




export { FalloutCronos };