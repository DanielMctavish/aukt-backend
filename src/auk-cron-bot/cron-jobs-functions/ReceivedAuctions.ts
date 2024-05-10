import { IAuct } from "../../app/entities/IAuct";
import { cronmarker } from "../AukCronBot";

const ReceivedAuctions = (auks:IAuct[]) => {

    console.clear()
    console.log('-------------------------AUKT CRON v 0.0.2-------------------------')
    console.log('RECEBIDOS:');
    cronmarker.auctions = auks
    console.log(cronmarker.auctions.length)
    console.log('-------------------------------------------------------------------')
    cronmarker.markAuctions()
    cronmarker.slotsStatus()

}

export default ReceivedAuctions;