import { IAuct } from "./IAuct"
import { IClient } from "./IClient"
import { ICreditCard } from "./ICreditCard"
import { IProduct } from "./IProduct"

export interface IAdvertiser {
    id: string
    amount: number
    nano_id: string
    name: string
    CPF: string
    company_name: string
    CNPJ?: string
    url_profile_cover?: string
    url_profile_company_logo_cover?: string
    company_adress: string
    email: string
    password: string
    address: string
    credit_cards?: ICreditCard[]
    Aucts?: IAuct[]
    Products?: IProduct[]
    Clients?: IClient[]
    police_status?: PoliceStatus
    created_at: Date
    updated_at: Date
}

export const PoliceStatus: { [x: string]: 'REGULAR' | 'WARNED' | 'SUSPENDED' | 'BANNED' | 'UNDER_REVIEW' } = {
    REGULAR: 'REGULAR',
    WARNED: 'WARNED',
    SUSPENDED: 'SUSPENDED',
    BANNED: 'BANNED',
    UNDER_REVIEW: 'UNDER_REVIEW'
}

export type PoliceStatus = typeof PoliceStatus[keyof typeof PoliceStatus]
