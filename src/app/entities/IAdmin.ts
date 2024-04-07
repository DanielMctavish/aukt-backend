import { ICreditCard } from "./ICreditCard"


export interface IAdmin {
    id: string
    name: string
    email: string
    password: string
    address: string
    admin_url_profile?: string
    credit_cards?: ICreditCard[] | any
    created_at: Date
    updated_at: Date
}