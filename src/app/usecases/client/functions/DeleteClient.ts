import { ClientResponse } from "../../IMainClient";
import PrismaClientRepositorie from "../../../repositorie/database/PrismaClientRepositorie";
const prismaClient = new PrismaClientRepositorie()

export const deleteClient = (client_id: string): Promise<ClientResponse> => {

    return new Promise(async (resolve, reject) => {

        try {

            if (!client_id) reject({ status_code: 403, body: "not params id passed" })
            const currentClient = await prismaClient.delete(client_id)

            if (currentClient)
                resolve({ status_code: 200, body: currentClient })

        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }

    })

}