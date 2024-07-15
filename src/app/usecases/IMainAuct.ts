import { FilePhoto } from "../../utils/Firebase/FirebaseOperations"
import { IAuct } from "../entities/IAuct"


export interface AuctResponse {
    status_code: number
    body: Object
}

interface params {
    auct_id: string
    creator_id: string
    nano_id: string
    status: any
}

interface IMainAuct {
    CreateAuct(data: IAuct): Promise<AuctResponse>
    FindAuct(data: any, params: params): Promise<AuctResponse>
    FindAuctByNanoId(data: any, params: params): Promise<AuctResponse>
    ListAuct(data: any, params: params): Promise<AuctResponse>
    ListAuctByStatus(data: any, params: params): Promise<AuctResponse>
    UpdateAuct(data: IAuct, params: params): Promise<AuctResponse>
    DeleteAuct(data: any, params: params): Promise<AuctResponse>

    FirebaseUploadCoverAuct(body: any, params: any, File: FilePhoto): Promise<AuctResponse>
    FirebaseDeleteCoverAuct(body: any, params: any, File: FilePhoto): Promise<AuctResponse>
}

export default IMainAuct