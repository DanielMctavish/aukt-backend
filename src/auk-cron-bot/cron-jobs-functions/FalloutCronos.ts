import { IFloorAuction } from "../interfaces/IBotResponses";
import { cronmarker } from "../AukCronBot";

let falloutInterval: NodeJS.Timeout

const FalloutCronos = (timerCronos: number, slotInformations: IFloorAuction, timerDelay?: number) => {

    // CONTADOR E BARRA DE PROGRESSO..............................................
    let count = 1

    if (timerDelay && timerDelay > 0) {
        count = timerDelay
    }


    const progressBarLength = timerCronos;
    process.stdout.write('\n');
    const progress = '█'.repeat(count).padEnd(progressBarLength, '░');
    process.stdout.cursorTo(0);
    process.stdout.clearLine(0)
    process.stdout.write(`\x1b[32m${progress}\x1b[0m`);

    falloutInterval = setInterval(async () => {

        count++;

        const updatedSlot = { ...slotInformations, timer_freezed: count }
        await cronmarker.slotsStatus().selectSlotAvailable(updatedSlot)

        const progress = '█'.repeat(count).padEnd(progressBarLength, '░');
        process.stdout.cursorTo(0);
        process.stdout.clearLine(0)
        process.stdout.write(`\x1b[32m${progress}\x1b[0m`);

        let minutes = Math.floor(count / 60);
        let seconds = count % 60;

        let timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        process.stdout.write(` ${timeDisplay}`);

        if (count === progressBarLength) {
            count = 0
            clearInterval(falloutInterval);
        }

    }, 1000);

}

export { FalloutCronos, falloutInterval };