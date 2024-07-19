import axios from "axios";
import { IFloorAuction } from "../interfaces/IBotResponses";
import { cronmarker } from "../AukCronBot";

import { WinnerTimer } from "./WinnerTimer";
import PrismaProductRepositorie from "../../app/repositorie/database/PrismaProductRepositorie";
import PrismaBidRepositorie from "../../app/repositorie/database/PrismaBidRepositorie";

let falloutInterval: NodeJS.Timeout
const prismaProduct = new PrismaProductRepositorie()
const prismaBid = new PrismaBidRepositorie()

interface IFalloutInterval {
    auct_id: string
    interval: NodeJS.Timeout
}

class FalloutCronos {
    public falloutIntervals: IFalloutInterval[] = []

    public start(timerCronos: number,
        slotInformations: IFloorAuction,
        timerDelay?: number) {
        return new Promise(async (resolve) => {

            // CONTADOR E BARRA DE PROGRESSO..............................................
            let count = 1

            if (timerDelay && timerDelay > 0) {
                count = timerDelay
            }

            const progressBarLength = timerCronos;
            // process.stdout.write('\n');
            // const progress = '█'.repeat(count).padEnd(progressBarLength, '░');
            // process.stdout.cursorTo(0);
            // process.stdout.clearLine(0)
            // process.stdout.write(`\x1b[32m${progress}\x1b[0m`);

            //MENSAGEIRO................................


            await axios.post(`${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${slotInformations.auct_id}`, {
                body: slotInformations,
                cronTimer: count
            })

            this.falloutIntervals.push({
                auct_id: slotInformations.auct_id,
                interval: setInterval(async () => {

                    count++;

                    const updatedSlot = { ...slotInformations, timer_freezed: count }
                    await cronmarker.slotsStatus().selectSlotAvailable(updatedSlot)

                    //MENSAGEIRO DENTRO DO INTERVALO................................
                    try {
                        await axios.post(`${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${slotInformations.auct_id}`, {
                            body: slotInformations,
                            cronTimer: count
                        })
                    } catch (error: any) {
                        console.error(error.message)
                    }

                    // const progress = '█'.repeat(count).padEnd(progressBarLength, '░');
                    // process.stdout.cursorTo(0);
                    // process.stdout.clearLine(0)
                    // process.stdout.write(`\x1b[32m${progress}\x1b[0m`);

                    let minutes = Math.floor(count / 60);
                    let seconds = count % 60;

                    let timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

                    // process.stdout.write(` ${timeDisplay}`);

                    if (count >= progressBarLength) {
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

                            if (currentWinner)
                                await prismaProduct.update({ winner_id: currentWinner }, slotInformations.current_product_id)
                                    .then((res: any) => {
                                        console.log("product_id -> ", slotInformations.current_product_id)
                                        console.log("current_winner -> ", currentWinner)
                                        console.log("observando currentProduct --> ", currentProduct?.Bid)
                                        console.log("winner updated --> ", res.winner_id)
                                    })

                            await axios.post(`${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${slotInformations.auct_id}-winner`, {
                                body: currentWinner,
                                cronTimer: count
                            })

                        } catch (error: any) {
                            console.log("err at try register winner ", error.message)
                        }

                        await WinnerTimer()
                        count = 0
                        resolve(true);
                    }

                }, 1000)
            })

        })
    }
}




export { FalloutCronos };