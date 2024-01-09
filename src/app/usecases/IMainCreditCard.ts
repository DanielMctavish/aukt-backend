import { ICreditCard } from "../entities/ICreditCard"

export interface CreditCardResponse {
    status_code: number
    body: Object
}

interface params {
    credit_id: string
    admin_id: string
    advertiser_id: string
    client_id: string
}

interface IMainCreditCard {
    create(data: ICreditCard): Promise<CreditCardResponse>
    find(data: any, params: params): Promise<CreditCardResponse>
    listByAdminID(data: any, params: params): Promise<CreditCardResponse>
    listByAdvertiserID(data: any, params: params): Promise<CreditCardResponse>
    listByClientID(data: any, params: params): Promise<CreditCardResponse>
    delete(data: any, params: params): Promise<CreditCardResponse>
}

export default IMainCreditCard