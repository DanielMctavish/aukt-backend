import { ICreditCard } from "../entities/ICreditCard"


export interface ICreditCardRepositorie {

    create(data: ICreditCard): Promise<ICreditCard>
    find(id: string): Promise<ICreditCard | null>
    listByAdminID(id:string): Promise<ICreditCard | null>
    listByAdvertiserID(id:string): Promise<ICreditCard | null>
    listByClientID(id:string): Promise<ICreditCard | null>
    delete(id: string): Promise<ICreditCard | null>

}