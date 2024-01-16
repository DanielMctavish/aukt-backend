import { FilePhoto } from "../../utils/Firebase/FirebaseOperations"
import { IProduct } from "../entities/IProduct"


export interface ProductResponse {
    status_code: number
    body: Object
}

interface params {
    product_id: string
    advertiser_id:string
}

interface IMainProduct{
    create(data: IProduct): Promise<ProductResponse>
    find(data: any, params: params): Promise<ProductResponse>
    listByAdvertiserId(data: any, params: params): Promise<ProductResponse>
    update(data: Partial<IProduct>, params: params): Promise<ProductResponse>
    delete(data: any, params: params): Promise<ProductResponse>

    FirebaseUploadProductImgs(body: any, params: any, File: FilePhoto): Promise<ProductResponse>
    FirebaseDeleteProductImg(body: any, params: any, File: FilePhoto): Promise<ProductResponse>
}

export default IMainProduct