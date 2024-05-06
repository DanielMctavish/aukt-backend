import dayjs from "dayjs";
import cron from "node-cron";
import { cronmarker } from "../AukCronBot";
import { IAuct } from "../../app/entities/IAuct";

const MarkAuctions = () => {

    cronmarker.auctions.forEach((auction: IAuct) => {

        for (const key in auction.auct_dates) {

            const currentMoment = dayjs().valueOf()
            const currentAuctionData = dayjs(auction.auct_dates[key].date_auct).add(1, 'day')

            const minutos = auction.auct_dates[key].hour.split(':')[1]
            const hora = auction.auct_dates[key].hour.split(':')[0]
            const diaDoMes = currentAuctionData.date();
            const mes = currentAuctionData.month() + 1;
            const diaDaSemana = currentAuctionData.day();

            if (currentMoment < currentAuctionData.valueOf()) {

                console.log('\x1b[36m%s\x1b[0m', 'LEILÃO:', auction.title);
                console.log('\x1b[35m%s\x1b[0m', 'GRUPO MARCADO:', auction.auct_dates[key].group);
                console.log('\x1b[33m%s\x1b[0m', `DATA DO PREGÃO: ${diaDoMes} de ${currentAuctionData.format('MMM')} às ${hora}:${minutos}`);
                console.log('\x1b[33m%s\x1b[0m', '🕒🕒...');
                console.log('');

                cron.schedule(`${minutos} ${hora} ${diaDoMes} ${mes} ${diaDaSemana}`, () => {
                    cronmarker.validatePlayFloor(dayjs().toDate())
                });

            }
        }
    })

}

export default MarkAuctions;