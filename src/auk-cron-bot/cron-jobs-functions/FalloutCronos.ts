

const FalloutCronos = (timerCronos: number) => {

    // CONTADOR E BARRA DE PROGRESSO..............................................
    let count = 1;
    const progressBarLength = timerCronos;
    process.stdout.write('\n');
    const progress = '█'.repeat(count).padEnd(progressBarLength, '░');
    process.stdout.cursorTo(0);
    process.stdout.clearLine(0)
    process.stdout.write(`\x1b[32m${progress}\x1b[0m`);

    const newInterval = setInterval(() => {
        count++;
        const progress = '█'.repeat(count).padEnd(progressBarLength, '░');
        process.stdout.cursorTo(0);
        process.stdout.clearLine(0)
        process.stdout.write(`\x1b[32m${progress}\x1b[0m`);

        let minutes = Math.floor(count / 60);
        let seconds = count % 60;

        let timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        process.stdout.write(` ${timeDisplay}`);

        if (count === progressBarLength) {
            clearInterval(newInterval);
            count = 0
        }

    }, 1000);

}

export default FalloutCronos;