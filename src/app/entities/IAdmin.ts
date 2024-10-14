import { ICreditCard } from "./ICreditCard"

export interface IAdmin {
    id: string
    name: string
    email: string
    password: string
    address: string
    /** URL da imagem de perfil do administrador */
    admin_url_profile?: string
    /** Lista de cartões de crédito associados ao administrador */
    credit_cards?: ICreditCard[]
    /** Saldo atual do administrador */
    balance?: number 
    /** Nível de acesso do administrador (ex: 'super', 'regular') */
    role?: 'super' | 'regular'
    /** Lista de permissões específicas do administrador */
    permissions?: string[]
    created_at: Date
    updated_at: Date
}



