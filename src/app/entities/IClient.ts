import { IAuct } from "./IAuct"
import IBid from "./IBid"
import { ICreditCard } from "./ICreditCard"


export interface IClient {
    id: string
    cpf: string
    name: string
    email: string
    password: string
    address: string
    client_avatar?: number
    nickname?: string
    credit_card?: ICreditCard[] | any
    subscribed_auct?: IAuct[] | any
    Bid?: IBid[] | any
    client_url_profile?: string
    verifiedEmail?: boolean
    created_at: Date
    updated_at: Date
    phone?: string
}