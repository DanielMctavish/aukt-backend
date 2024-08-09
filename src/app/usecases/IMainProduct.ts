import { FilePhoto } from "../../utils/Firebase/FirebaseOperations"
import IParams from "../entities/IParams"
import { IProduct } from "../entities/IProduct"

export interface ProductResponse {
    status_code: number
    body: Object
}

// take: string,
// skip?: string,
// categorie?: string,
// group?: string,
// lote_order?: any,
// initial_value_order?: any,
// bid_count_order?: any


interface IMainProduct {
    create(data: IProduct): Promise<ProductResponse>
    find(data: any, params: IParams): Promise<ProductResponse>
    findByTitle(data: any, params: IParams): Promise<ProductResponse>

    //listagem
    listByAdvertiserId(data: any, params: IParams): Promise<ProductResponse>
    listByCategorie(data: any, params: IParams): Promise<ProductResponse>
    listProductsByFilters(data: any, params: IParams): Promise<ProductResponse>

    update(data: Partial<IProduct>, params: IParams): Promise<ProductResponse>
    delete(data: any, params: IParams): Promise<ProductResponse>

    FirebaseUploadProductCover(body: any, params: any, File: FilePhoto): Promise<ProductResponse>
    FirebaseUploadProductImgs(body: any, params: any, File: any, Files: Array<FilePhoto>): Promise<ProductResponse>
    FirebaseDeleteProductImg(body: any, params: any, File: FilePhoto): Promise<ProductResponse>
}


export default IMainProduct