import { IAdvertiser } from "./IAdvertiser"
import IBid from "./IBid"
import { ICartela } from "./ICartela"
import { IClient } from "./IClient"
import { IProduct } from "./IProduct"

export interface AuctDateGroups {
    id: string
    date_auct: Date
    group_status: AuctStatus,
    hour: string
    group: string
    Auct?: IAuct | any
    auctId: string | any
}

export interface IAuct {
    id: string
    nano_id: string | null
    categorie: string | null
    creator_id: string
    advertiser_id?: string | null
    Advertiser?: IAdvertiser | any
    client_id?: string | any
    subscribed_clients?: IClient[]
    Bid?: IBid[]
    Cartelas: ICartela[]
    title: string
    tags: string[]
    auct_cover_img: string
    product_list?: IProduct[]
    descriptions_informations: string
    terms_conditions: string
    auct_dates: AuctDateGroups[];
    limit_client: boolean
    limit_date: boolean
    accept_payment_methods: PaymentMethod[]
    value: string
    status: AuctStatus
    product_timer_seconds: number
    public?: boolean
    created_at: Date
    updated_at: Date
}

export const AuctStatus: { [x: string]: 'cataloged' | 'live' | 'canceled' | 'finished' | 'paused' | 'pending' } = {
    cataloged: 'cataloged',
    live: 'live',
    canceled: 'canceled',
    finished: 'finished',
    paused: 'paused',
    pending: 'pending'
}

const PaymentMethod: { [x: string]: 'Credit' | 'Debit' | 'Pix' | 'Ticket' } = {
    Credit: 'Credit',
    Debit: 'Debit',
    Pix: 'Pix',
    Ticket: 'Ticket'
}

export type AuctStatus = typeof AuctStatus[keyof typeof AuctStatus]
export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod]