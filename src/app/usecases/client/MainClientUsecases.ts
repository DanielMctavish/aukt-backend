import { FilePhoto } from "../../../utils/Firebase/FirebaseOperations";
import IBid from "../../entities/IBid";
import { IClient } from "../../entities/IClient";
import IMainClient, { ClientResponse } from "../IMainClient";
import firebaseDeleteClientProfile from "./firebase/FirebaseDeleteClientProfile";
import firebaseUploadClientProfile from "./firebase/FirebaseUploadClientProfile";
import { bidAuct } from "./functions/BidAuct";
import { createClient } from "./functions/CreateClient";
import { deleteClient } from "./functions/DeleteClient";
import { findBid } from "./functions/FindBid";
import { findClient } from "./functions/FindClient";
import { findClientByEmail } from "./functions/FindClientByEmail";
import { listBidByClientId } from "./functions/ListBidByClientId";
import { listClient } from "./functions/ListClient";
import { loginClient } from "./functions/LoginClient";
import { subscribedAuct } from "./functions/SubscribedAuct";
import { updateClient } from "./functions/UpdateClient";

interface params {
    bid_id: string;
    auct_id: string
    client_id: string
    email: string
    value: number
}

class MainClientUsecases implements IMainClient {

    async CreateClient(data: IClient): Promise<ClientResponse> {
        return createClient(data)
    }

    async FindClient(data: any, params: params): Promise<ClientResponse> {
        return findClient(params.client_id)
    }

    async FindClientByEmail(data: any, params: params): Promise<ClientResponse> {
        return findClientByEmail(params.email)
    }

    async ListClient(): Promise<ClientResponse> {
        return listClient()
    }

    async UpdateClient(data: IClient, params: params): Promise<ClientResponse> {
        return updateClient(data, params.client_id)
    }

    async DeleteClient(data: any, params: params): Promise<ClientResponse> {
        return deleteClient(params.client_id)
    }

    // AUCT OPERATIONS..................................................................

    async BidAuct(data: IBid): Promise<ClientResponse> {
        return bidAuct(data)
    }

    async FindBid(data: any, params: params): Promise<ClientResponse> {
        return findBid(params.value)
    }

    async ListBidByClientId(data: any, params: params): Promise<ClientResponse> {
        return listBidByClientId(params.client_id)
    }

    async SubscribedAuct(data: any, params: params): Promise<ClientResponse> {
        return subscribedAuct(params.client_id, params.auct_id)
    }

    //ACCESS
    async LoginClient(data: Partial<IClient>): Promise<ClientResponse> {
        return loginClient(data)
    }

    // FIREBASE..........................................................................

    FirebaseUploadClientProfile(body: any, params: any, File: FilePhoto): Promise<ClientResponse> {
        return firebaseUploadClientProfile(params.client_id, File)
    }
    FirebaseDeleteClientProfile(body: any, params: any, File: FilePhoto): Promise<ClientResponse> {
        return firebaseDeleteClientProfile(params)
    }

}

export default MainClientUsecases