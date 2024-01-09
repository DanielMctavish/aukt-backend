import { IAdvertiser } from "./IAdvertiser"
import IBid from "./IBid"
import { IClient } from "./IClient"
import { IProduct } from "./IProduct"


export interface IAuct {
    id: string
    creator_id: string
    advertiser_id?: string
    Advertiser?: IAdvertiser | any
    winner_id?: string | any
    client_id?: string | any
    subscribed_clients?: IClient[]
    Bid?: IBid[]
    title: string
    tags: string[]
    auct_cover_img: string
    product_list?: IProduct[]
    descriptions_informations: string
    terms_conditions: string
    auct_date: Date[]
    limit_client: boolean
    limit_date: boolean
    accept_payment_methods: PaymentMethod
    value: string
    created_at: Date
    updated_at: Date
}


const PaymentMethod: { [x: string]: 'Credit' | 'Debit' | 'Pix' | 'Ticket' } = {
    Credit: 'Credit',
    Debit: 'Debit',
    Pix: 'Pix',
    Ticket: 'Ticket'
}

export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod]