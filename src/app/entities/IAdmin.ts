import { ICreditCard } from "./ICreditCard"


export interface IAdmin{
    id:string
    name:string
    email:string
    password:string
    address:string
    credit_cards?: ICreditCard[]
    created_at: Date
    updated_at: Date
}