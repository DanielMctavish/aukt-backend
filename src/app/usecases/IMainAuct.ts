import { IAuct } from "../entities/IAuct"


export interface AuctResponse {
    status_code: number
    body: Object
}

interface params {
    auct_id: string
    creator_id: string
}

interface IMainAuct {
    CreateAuct(data: IAuct): Promise<AuctResponse>
    FindAuct(data: any, params: params): Promise<AuctResponse>
    ListAuct(data: any, params: params): Promise<AuctResponse>
    UpdateAuct(data: IAuct, params: params): Promise<AuctResponse>
    DeleteAuct(data: any, params: params): Promise<AuctResponse>
}

export default IMainAuct