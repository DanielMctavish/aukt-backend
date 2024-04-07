import { IAuct } from "./IAuct"
import { ICreditCard } from "./ICreditCard"
import { IProduct } from "./IProduct"


export interface IAdvertiser {
    id: string
    nano_id:string
    name: string
    CPF: string
    company_name:string
    CNPJ?:string
    url_profile_cover?: string
    url_profile_company_logo_cover?: string
    company_adress:string
    email: string
    password: string
    address: string
    credit_cards?: ICreditCard[]
    Aucts?: IAuct[]
    Products?: IProduct[]
    created_at: Date
    updated_at: Date
}
