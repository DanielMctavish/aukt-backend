import { IClient } from "../../entities/IClient";
import IMainClient, { ClientResponse } from "../IMainClient";
import { createClient } from "./functions/CreateClient";
import { deleteClient } from "./functions/DeleteClient";
import { findClient } from "./functions/FindClient";
import { findClientByEmail } from "./functions/FindClientByEmail";
import { listClient } from "./functions/ListClient";
import { updateClient } from "./functions/UpdateClient";

interface params {
    id: string
}

class MainClientUsecases implements IMainClient {

    async CreateClient(data: IClient): Promise<ClientResponse> {
        return createClient(data)
    }

    async FindClient(client_id: string): Promise<ClientResponse> {
        return findClient(client_id)
    }

    async FindClientByEmail(email: string): Promise<ClientResponse> {
        return findClientByEmail(email)
    }

    async ListClient(): Promise<ClientResponse> {
        return listClient()
    }

    async UpdateClient(data: IClient, params: params): Promise<ClientResponse> {
        return updateClient(data, params.id)
    }

    async DeleteClient(client_id: string): Promise<ClientResponse> {
        return deleteClient(client_id)
    }

}

export default MainClientUsecases