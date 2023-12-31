import { ICreditCard } from "../entities/ICreditCard"

export interface CreditCardResponse {
    status_code: number
    body: Object
}

interface params {
    id: string
}

interface IMainCreditCard{
    create(data: ICreditCard): Promise<CreditCardResponse>
    find(id: string): Promise<CreditCardResponse>
    listByAdminID(id: string): Promise<CreditCardResponse>
    listByAdvertiserID(id: string): Promise<CreditCardResponse>
    listByClientID(id: string): Promise<CreditCardResponse>
    delete(id: string): Promise<CreditCardResponse>
}

export default IMainCreditCard