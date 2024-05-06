import { IAuct } from "../../app/entities/IAuct"
import { cronmarker } from "../AukCronBot"

const StartAuction = (auct_id: string | any) => {

    console.clear()
    console.log('--------------------------------------------------------')
    console.log('starting auction... ')
    const auctSelected: IAuct[] = cronmarker.auctions.filter(auction => auction.id === auct_id)
    console.log(auctSelected[0].title)
    console.log(auctSelected[0].auct_dates[0].group)

    cronmarker.renderFloor(auctSelected[0], auctSelected[0].auct_dates[0])

}

export default StartAuction;