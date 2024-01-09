import { ClientResponse } from "../../IMainClient";
import PrismaClientRepositorie from "../../../repositorie/database/PrismaClientRepositorie";
const prismaClient = new PrismaClientRepositorie()


export const findClientByEmail = (email: string): Promise<ClientResponse> => {

    return new Promise(async (resolve, reject) => {

        try {

            const currentClient = await prismaClient.findByEmail(email)
            if (currentClient) {
                resolve({ status_code: 200, body: currentClient })
            } else {
                reject({ status_code: 404, body: 'not client founded' })
            }

        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }

    })

}