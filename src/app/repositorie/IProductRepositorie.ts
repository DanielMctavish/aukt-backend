import { IProduct } from "../entities/IProduct"


export interface IProductRepositorie {
    create(data: IProduct): Promise<IProduct>
    find(id: string): Promise<IProduct | null>
    listByAdvertiserId(id: string): Promise<IProduct[]>
    update(data: Partial<IProduct>, id: string): Promise<IProduct | null>
    delete(id: string): Promise<IProduct | null>
}