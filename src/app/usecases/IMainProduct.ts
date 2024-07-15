import { FilePhoto } from "../../utils/Firebase/FirebaseOperations"
import { IProduct } from "../entities/IProduct"


export interface ProductResponse {
    status_code: number
    body: Object
}

interface params {
    product_id: string
    advertiser_id: string
    offset: string
    categorie: string
}

interface IMainProduct {
    create(data: IProduct): Promise<ProductResponse>
    find(data: any, params: params): Promise<ProductResponse>
    findByTitle(data: any, params: params): Promise<ProductResponse>
    list(data: any, params: params): Promise<ProductResponse>
    listByAdvertiserId(data: any, params: params): Promise<ProductResponse>
    listByCategorie(data: any, params: params): Promise<ProductResponse>
    update(data: Partial<IProduct>, params: params): Promise<ProductResponse>
    delete(data: any, params: params): Promise<ProductResponse>

    FirebaseUploadProductCover(body: any, params: any, File: FilePhoto): Promise<ProductResponse>
    FirebaseUploadProductImgs(body: any, params: any, File: any, Files: Array<FilePhoto>): Promise<ProductResponse>
    FirebaseDeleteProductImg(body: any, params: any, File: FilePhoto): Promise<ProductResponse>
}

export default IMainProduct