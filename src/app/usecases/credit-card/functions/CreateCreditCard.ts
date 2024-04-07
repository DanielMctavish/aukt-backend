import { ClientResponse } from "../../IMainClient";
import PrismaCreditCardRepositorie from "../../../repositorie/database/PrismaCreditCardRepositorie";
import { ICreditCard } from "../../../entities/ICreditCard";
const prismaCreditCard = new PrismaCreditCardRepositorie()

export const createCreditCard = (data: ICreditCard): Promise<ClientResponse> => {

    return new Promise(async (resolve, reject) => {

        try {
            const currentCard = await prismaCreditCard.create(data)
            resolve({ status_code: 201, body: currentCard })
        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }

    })

}