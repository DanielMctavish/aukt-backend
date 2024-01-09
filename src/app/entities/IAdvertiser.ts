import { IAuct } from "./IAuct"
import { ICreditCard } from "./ICreditCard"
import { IProduct } from "./IProduct"


export interface IAdvertiser {
    id: string
    name: string
    CPF: string
    nickname: string
    url_fake_cover: string
    url_profile_cover: string
    email: string
    password: string
    address: string
    credit_cards?: ICreditCard[]
    Aucts?: IAuct[]
    Products?: IProduct[]
    created_at: Date
    updated_at: Date
}