import IParams from "../entities/IParams"
import { IProduct } from "../entities/IProduct"


export interface IProductRepositorie {
    create(data: IProduct): Promise<IProduct>
    find(params: Partial<IParams>): Promise<IProduct | null>
    findByTitle(title: string): Promise<IProduct[]>
    listByAdvertiserId(id: string): Promise<IProduct[]>
    listByCategorie(categorie: string): Promise<IProduct[]>
    update(data: Partial<IProduct>, id: string): Promise<IProduct | null>
    delete(id: string): Promise<IProduct | null>
}