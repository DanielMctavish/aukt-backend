import axios from "axios";
import { IFloorAuction } from "../interfaces/IBotResponses";
import { cronmarker } from "../AukCronBot";

import { WinnerTimer } from "./WinnerTimer";
import PrismaProductRepositorie from "../../app/repositorie/database/PrismaProductRepositorie";
import PrismaBidRepositorie from "../../app/repositorie/database/PrismaBidRepositorie";

let falloutInterval: NodeJS.Timeout
const prismaProduct = new PrismaProductRepositorie()
const prismaBid = new PrismaBidRepositorie()

const FalloutCronos = async (timerCronos: number, slotInformations: IFloorAuction, timerDelay?: number) => {

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

      
        await axios.post(`${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=aukt-server-floor-live`, {
            body: slotInformations,
            cronTimer: count
        })

        falloutInterval = setInterval(async () => {

            count++;

            const updatedSlot = { ...slotInformations, timer_freezed: count }
            await cronmarker.slotsStatus().selectSlotAvailable(updatedSlot)

            //MENSAGEIRO DENTRO DO INTERVALO................................
            await axios.post(`${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=aukt-server-floor-live`, {
                body: slotInformations,
                cronTimer: count
            })

            // const progress = '█'.repeat(count).padEnd(progressBarLength, '░');
            // process.stdout.cursorTo(0);
            // process.stdout.clearLine(0)
            // process.stdout.write(`\x1b[32m${progress}\x1b[0m`);

            let minutes = Math.floor(count / 60);
            let seconds = count % 60;

            let timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            // process.stdout.write(` ${timeDisplay}`);

            if (count >= progressBarLength) {
                clearInterval(falloutInterval);

                //Identificar e determinar o vencedor................................................................
                try {

                    const bidList = await prismaBid.List(slotInformations.current_product_id)
                    let currentValue = 0
                    let currentWinner = ""

                    for (const [index, bid] of bidList.entries()) {
                        if (bid.value > currentValue) {
                            currentValue = bid.value
                            currentWinner = bid.id
                        }
                    }

                    await prismaProduct.update({ winner_id: currentWinner }, slotInformations.current_product_id)
                    await axios.post(`${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=aukt-server-floor-winner`, {
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

        }, 1000);

    })

}

export { FalloutCronos, falloutInterval };