import { IAdvertiser } from "./IAdvertiser"
import { ICartela } from "./ICartela"


interface ITransaction {
    id: string
    amount: number
    advertiser_earnings?: number
    admin_earnings?: number
    advertiser: IAdvertiser
    advertiser_id: string
    auction_cartela?: ICartela
    cartela_id?: string
    payment_method: PaymentMethod
    created_at: Date
    updated_at: Date
}

export const PaymentMethod: { [x: string]: 'Pix' | 'Credit' | 'Debit' | 'Ticket' } = {
    Pix: 'Pix',
    Credit: 'Credit',
    Debit: 'Debit',
    Ticket: 'Ticket'
}

export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod]

export { ITransaction }