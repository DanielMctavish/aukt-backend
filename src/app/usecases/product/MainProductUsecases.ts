import { FilePhoto } from "../../../utils/Firebase/FirebaseOperations";
import { IProduct } from "../../entities/IProduct";
import IMainProduct, { ProductResponse } from "../IMainProduct";
import firebaseDeleteProductImg from "./firebase/FirebaseDeleteProductImg";
import firebaseUploadProductCover from "./firebase/FirebaseUploadProductCover";
import firebaseUploadProductsImgs from "./firebase/FirebaseUploadProductImgs";
import { createProduct } from "./functions/createProduct";
import { deleteProduct } from "./functions/deleteProduct";
import { findProduct } from "./functions/findProduct";
import { getProductByTitle } from "./functions/getProductByTitle";
import { listallproductsByCategorie } from "./functions/listallproductsByCategorie";
import { listProductByAdvertiser } from "./functions/listProductByAdvertiser";
import { listProductsByOffset } from "./functions/listProductsByOffset";
import { updateProduct } from "./functions/updateProduct";

interface params {
    product_id: string
    url_product: string
    advertiser_id: string
    categorie: string
    offset: string
    title: string
}
class MainProductUsecases implements IMainProduct {
    create(data: IProduct): Promise<ProductResponse> {
        return createProduct(data)
    }
    find(data: any, params: params): Promise<ProductResponse> {
        return findProduct(params.product_id)
    }
    findByTitle(data: any, params: params): Promise<ProductResponse> {
        return getProductByTitle(params.title)
    }
    list(data: any, params: params): Promise<ProductResponse> {
        return listProductsByOffset(params.offset)
    }
    listByAdvertiserId(data: any, params: params): Promise<ProductResponse> {
        return listProductByAdvertiser(params.advertiser_id)
    }
    listByCategorie(data: any, params: params): Promise<ProductResponse> {
        return listallproductsByCategorie(params.categorie)
    }
    update(data: Partial<IProduct>, params: params): Promise<ProductResponse> {
        return updateProduct(data, params.product_id)
    }
    delete(data: any, params: params): Promise<ProductResponse> {
        return deleteProduct(params.product_id)
    }

    FirebaseUploadProductCover(body: any, params: params, File: FilePhoto): Promise<ProductResponse> {
        return firebaseUploadProductCover(params.product_id, File)
    }

    FirebaseUploadProductImgs(body: any, params: params, File: any, Files: Array<FilePhoto>): Promise<ProductResponse> {
        return firebaseUploadProductsImgs(params.product_id, Files)
    }
    FirebaseDeleteProductImg(body: any, params: any): Promise<ProductResponse> {
        return firebaseDeleteProductImg(params)
    }
}

export default MainProductUsecases