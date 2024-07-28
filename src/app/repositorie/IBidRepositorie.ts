import IBid from "../entities/IBid";


interface IBidRepositorie {
    CreateBid(data: IBid): Promise<IBid>
    FindBid(value: number): Promise<IBid | null>
    List(client_id: string): Promise<IBid[]>
    ListByAuctId(auct_id: string): Promise<IBid[]>
}



export default IBidRepositorie