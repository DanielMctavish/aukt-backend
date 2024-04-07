import { ClientResponse } from "../../IMainClient";
import PrismaClientRepositorie from "../../../repositorie/database/PrismaClientRepositorie";
const prismaClient = new PrismaClientRepositorie()


export const listClient = (): Promise<ClientResponse> => {

    return new Promise(async (resolve, reject) => {

        try {

            const listClients = await prismaClient.list()

            if (listClients)
                resolve({ status_code: 200, body: listClients })

        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }

    })

}