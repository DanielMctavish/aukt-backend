import { IAuct } from "../../app/entities/IAuct";
import { cronmarker } from "../AukCronBot";

const ReceivedAuctions = (auks:IAuct[]) => {

    cronmarker.auctions = auks
    cronmarker.markAuctions()

}

export default ReceivedAuctions;