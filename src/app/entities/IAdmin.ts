import { ICreditCard } from "./ICreditCard"


export interface IAdmin {
    id: string
    name: string
    email: string
    password: string
    address: string
    admin_url_profile?: string
    credit_cards?: ICreditCard[] | any
    balance?: number 
    created_at: Date
    updated_at: Date
}