import { ClientResponse } from "../../IMainClient";
// import PrismaClientRepositorie from "../../../repositorie/database/PrismaClientRepositorie";
import PrismaBidRepositorie from "../../../repositorie/database/PrismaBidRepositorie";

// const prismaClient = new PrismaClientRepositorie()
const prismaBid = new PrismaBidRepositorie()

export const listBidByClientId = (client_id: string): Promise<ClientResponse> => {

    return new Promise(async (resolve, reject) => {

        try {
            if (!client_id) {
                return reject({ status_code: 403, body: 'client_id not sended' })
            }
            const listBids = await prismaBid.List(client_id)

            if (listBids)
                resolve({ status_code: 200, body: listBids })

        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }

    })

}