import { ClientResponse } from "../../IMainClient";
import PrismaCreditCardRepositorie from "../../../repositorie/database/PrismaCreditCardRepositorie";
const prismaCreditCard = new PrismaCreditCardRepositorie()

export const deleteCreditCard = (card_id: string): Promise<ClientResponse> => {

    return new Promise(async (resolve, reject) => {

        try {
            const currentCard = await prismaCreditCard.delete(card_id)
            resolve({ status_code: 201, body: !currentCard ? 'not creditCard founded' : currentCard })
        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }

    })

}