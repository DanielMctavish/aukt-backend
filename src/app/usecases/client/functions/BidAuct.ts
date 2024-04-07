import IBid from "../../../entities/IBid";
import { ClientResponse } from "../../IMainClient";
import PrismaBidRepositorie from "../../../repositorie/database/PrismaBidRepositorie";
const prismaBid = new PrismaBidRepositorie()

export const bidAuct = (data: IBid): Promise<ClientResponse> => {

    return new Promise(async (resolve, reject) => {

        try {

            const currentBid = await prismaBid.CreateBid(data)
            resolve({ status_code: 200, body: currentBid })

        } catch (error: any) {

            reject({ status_code: 500, body: error.message })

        }

    })

}