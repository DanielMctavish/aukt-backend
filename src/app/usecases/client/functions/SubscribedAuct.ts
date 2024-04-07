import { ClientResponse } from "../../IMainClient"
import PrismaAuctRepositorie from "../../../repositorie/database/PrismaAuctRepositorie";
const prismaAuct = new PrismaAuctRepositorie()

export const subscribedAuct = (client_id: string, auct_id: string): Promise<ClientResponse> => {

    return new Promise(async (resolve, reject) => {

        try {

            const currentBid = await prismaAuct.update({ client_id }, auct_id)
            if (!currentBid) return reject({ status_code: 404, body: 'not bid sended' })

            resolve({ status_code: 200, body: currentBid })

        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }

    })

}