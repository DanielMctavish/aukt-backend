import { FilePhoto } from "../../utils/Firebase/FirebaseOperations"
import IBid from "../entities/IBid"
import { IClient } from "../entities/IClient"


export interface ClientResponse {
    status_code: number
    body: Object
}

interface params {
    id: string
    auct_id: string
    client_id: string
    email: string
}

interface IMainClient {
    CreateClient(data: IClient): Promise<ClientResponse>
    FindClient(data: any, params: params): Promise<ClientResponse>
    FindClientByEmail(data: any, params: params): Promise<ClientResponse>
    ListClient(): Promise<ClientResponse>
    UpdateClient(data: IClient, params: params): Promise<ClientResponse>
    DeleteClient(data: any, params: params): Promise<ClientResponse>

    // AUCT OPERATIONS
    SubscribedAuct(data: any, params: params): Promise<ClientResponse>
    BidAuct(bid: IBid): Promise<ClientResponse>
    //ACCESS
    LoginClient(data: Partial<IClient>): Promise<ClientResponse>
    //FIREBASE
    FirebaseUploadClientProfile(body: any, params: any, File: FilePhoto): Promise<ClientResponse>
    FirebaseDeleteClientProfile(body: any, params: any, File: FilePhoto): Promise<ClientResponse>

}

export default IMainClient