import { ClientResponse } from "../../IMainClient";
import PrismaBidRepositorie from "../../../repositorie/database/PrismaBidRepositorie";
const prismaBid = new PrismaBidRepositorie()

export const findBid = (value: number): Promise<ClientResponse> => {

    return new Promise(async (resolve, reject) => {

        const currentValue = typeof value !== 'number' ? parseFloat(value) : value

        try {

            const currentBid = await prismaBid.FindBid(currentValue)
            if (currentBid) {
                resolve({ status_code: 200, body: currentBid })
            } else {
                resolve({ status_code: 404, body: 'not bid founded' })
            }

        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }

    })

}