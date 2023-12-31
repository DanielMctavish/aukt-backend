import { ClientResponse } from "../../IMainClient";
import PrismaClientRepositorie from "../../../repositorie/database/PrismaClientRepositorie";
import { IClient } from "../../../entities/IClient";
const prismaClient = new PrismaClientRepositorie()


export const updateClient = (data: IClient, client_id: string): Promise<ClientResponse> => {

    return new Promise(async (resolve, reject) => {

        try {

            const currentClient = await prismaClient.update(data, client_id)
            resolve({ status_code: 200, body: currentClient })

        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }

    })

}