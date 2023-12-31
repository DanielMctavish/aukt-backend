import { IProduct } from "../entities/IProduct"


export interface ProductResponse {
    status_code: number
    body: Object
}

interface params {
    id: string
}

interface IMainProduct{
    create(data: IProduct): Promise<ProductResponse>
    find(id: string): Promise<ProductResponse>
    listByAdvertiserId(id: string): Promise<ProductResponse>
    update(data: Partial<IProduct>, params: params): Promise<ProductResponse>
    delete(id: string): Promise<ProductResponse>
}

export default IMainProduct