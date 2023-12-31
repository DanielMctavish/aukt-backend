import { IAuct } from "../entities/IAuct"


export interface AuctResponse {
    status_code: number
    body: Object
}

interface params {
    id: string
}

interface IMainAuct {
    CreateAuct(data: IAuct): Promise<AuctResponse>
    FindAuct(auct: Partial<IAuct>): Promise<AuctResponse>
    ListAuct(auct: Partial<IAuct>): Promise<AuctResponse>
    UpdateAuct(data: IAuct, params: params): Promise<AuctResponse>
    DeleteAuct(auct: Partial<IAuct>): Promise<AuctResponse>
}

export default IMainAuct