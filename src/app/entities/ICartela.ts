import { IAdvertiser } from "./IAdvertiser"
import { IAuct } from "./IAuct"
import { IClient } from "./IClient"
import { IProduct } from "./IProduct"
import { ITransaction } from "./ITransaction"


interface ICartela {
    id: string
    Advertiser: IAdvertiser
    advertiser_id: string
    Auct: IAuct
    auction_id: string
    Client: IClient
    client_id: string
    products: IProduct[]
    amount: number
    status: CartelaStatus
    tracking_code: string
    transaction: ITransaction
    transaction_id: string
    created_at: Date
    updated_at: Date
}

export const CartelaStatus: { [x: string]: 'PENDENT' | 'PAYMENT_CONFIRMED' | 'PROCESS' | 'SENDED' | 'DELIVERED' | 'DENIED' } = {
    PENDENT: 'PENDENT',
    PAYMENT_CONFIRMED: 'PAYMENT_CONFIRMED',
    PROCESS: 'PROCESS',
    SENDED: 'SENDED',
    DELIVERED: 'DELIVERED',
    DENIED: 'DENIED',
}


export type CartelaStatus = typeof CartelaStatus[keyof typeof CartelaStatus]

export { ICartela }