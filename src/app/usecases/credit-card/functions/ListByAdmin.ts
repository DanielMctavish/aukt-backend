import { ClientResponse } from "../../IMainClient";
import PrismaCreditCardRepositorie from "../../../repositorie/database/PrismaCreditCardRepositorie";
const prismaCreditCard = new PrismaCreditCardRepositorie()

export const listCreditCardByAdmin = (admin_id: string): Promise<ClientResponse> => {

    return new Promise(async (resolve, reject) => {

        try {
            const currentCard = await prismaCreditCard.listByAdminID(admin_id)
            resolve({ status_code: 200, body: !currentCard ? 'not creditCard founded' : currentCard })
        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }

    })

}