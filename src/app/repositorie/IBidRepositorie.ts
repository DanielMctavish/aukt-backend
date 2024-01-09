import IBid from "../entities/IBid";


interface IBidRepositorie {
    CreateBid(data: IBid): Promise<IBid>
    FindBid(bid_id: string): Promise<IBid | null>
    List(): Promise<IBid[]>
    ListByAuctId(auct_id: string): Promise<IBid[]>
}



export default IBidRepositorie