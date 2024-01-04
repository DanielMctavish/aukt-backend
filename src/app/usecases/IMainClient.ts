import { IClient } from "../entities/IClient"


export interface ClientResponse {
    status_code: number
    body: Object
}

interface params {
    id: string
}

interface IMainClient {
    CreateClient(data: IClient): Promise<ClientResponse>
    FindClient(data: any, client_id: string): Promise<ClientResponse>
    FindClientByEmail(data: any, email: string): Promise<ClientResponse>
    ListClient(): Promise<ClientResponse>
    UpdateClient(data: IClient, params: params): Promise<ClientResponse>
    DeleteClient(client_id: string): Promise<ClientResponse>

    // AUCT OPERATIONS
    SubscribedAuct(auct_id: string): Promise<ClientResponse>
    BidAuct(): Promise<ClientResponse>

}

export default IMainClient