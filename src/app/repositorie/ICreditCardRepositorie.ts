import { ICreditCard } from "../entities/ICreditCard"


export interface ICreditCardRepositorie {

    create(data: ICreditCard): Promise<ICreditCard>
    find(id: string): Promise<ICreditCard | null>
    listByAdminID(id: string): Promise<ICreditCard[]>
    listByAdvertiserID(id: string): Promise<ICreditCard[]>
    listByClientID(id: string): Promise<ICreditCard[]>
    delete(id: string): Promise<ICreditCard | null>

}