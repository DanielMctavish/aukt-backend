import { ClientResponse } from "../../IMainClient";
import PrismaCreditCardRepositorie from "../../../repositorie/database/PrismaCreditCardRepositorie";
const prismaCreditCard = new PrismaCreditCardRepositorie()

export const listCreditCardByClient = (client_id: string): Promise<ClientResponse> => {

    return new Promise(async (resolve, reject) => {

        try {
            const listCard = await prismaCreditCard.listByClientID(client_id)
            resolve({ status_code: 200, body: !listCard ? 'not creditCard founded' : listCard })
        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }

    })

}