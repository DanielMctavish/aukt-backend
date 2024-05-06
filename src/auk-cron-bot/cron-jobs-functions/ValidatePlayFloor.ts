import dayjs from 'dayjs';
import { cronmarker } from '../AukCronBot';

const ValidatePlayFloor = (currentTime: Date) => {

    const currenTime = dayjs(currentTime)
    const minutes = currenTime.minute()
    const hours = currenTime.hour()
    const day = currenTime.date()
    const month = currenTime.month()
    const year = currenTime.year()

    cronmarker.auctions.forEach(auction => {

        auction.auct_dates.forEach(auctionDate => {
            const auctMinute = auctionDate.hour.split(':')[1]
            const auctHour = auctionDate.hour.split(':')[0]
            const auctDay = dayjs(auctionDate.date_auct).date() + 1
            const auctMonth = dayjs(auctionDate.date_auct).month()
            const auctYear = dayjs(auctionDate.date_auct).year()

            const timerCron = dayjs()
                .set('minute', minutes)
                .set('hour', hours)
                .set('date', day)
                .set('month', month)
                .set('year', year)

            const auctDate = dayjs()
                .set('minute', parseInt(auctMinute))
                .set('hour', parseInt(auctHour))
                .set('date', auctDay)
                .set('month', auctMonth)
                .set('year', auctYear)

            if (timerCron.format('DD/MM/YYYY HH:mm') === auctDate.format('DD/MM/YYYY HH:mm')) {

                console.log('--------------------------------------- PREGÃO -----------------------------------------')
                console.log('LEILÃO: ', auction.title)
                console.log('GRUPO: ', auctionDate.group)
                cronmarker.renderFloor(auction, auctionDate)

            }

        })

    })

}

export default ValidatePlayFloor;