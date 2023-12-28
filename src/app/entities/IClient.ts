import { ICreditCard } from "./ICreditCard"


export interface IClient {
    id: string
    cpf: string
    name: string
    email: string
    password: string
    address: string
    credit_card?: ICreditCard
    created_at: Date
    updated_at: Date
}