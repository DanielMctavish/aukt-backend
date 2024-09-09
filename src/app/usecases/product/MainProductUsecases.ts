import { FilePhoto } from "../../../utils/Firebase/FirebaseOperations";
import IParams from "../../entities/IParams";
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
import { ListProductsByFilters } from "./functions/listProductsByFilters";
import { updateProduct } from "./functions/updateProduct";
import { counterProducts, counterProductsWithBids } from "./functions/CounterProducts";

class MainProductUsecases implements IMainProduct {
    create(data: IProduct): Promise<ProductResponse> {
        return createProduct(data)
    }
    find(data: any, params: IParams): Promise<ProductResponse> {
        return findProduct(params)
    }
    findByTitle(data: any, params: IParams): Promise<ProductResponse> {
        return getProductByTitle(params.title)
    }
    listProductsByFilters(data: any, params: IParams): Promise<ProductResponse> {
        return ListProductsByFilters(params)
    }
    listByAdvertiserId(data: any, params: IParams): Promise<ProductResponse> {
        return listProductByAdvertiser(params.advertiser_id)
    }
    listByCategorie(data: any, params: IParams): Promise<ProductResponse> {
        return listallproductsByCategorie(params.categorie)
    }

    update(data: Partial<IProduct>, params: IParams): Promise<ProductResponse> {
        return updateProduct(data, params.product_id)
    }
    delete(data: any, params: IParams): Promise<ProductResponse> {
        return deleteProduct(params.product_id)
    }

    FirebaseUploadProductCover(body: any, params: IParams, File: FilePhoto): Promise<ProductResponse> {
        return firebaseUploadProductCover(params.product_id, File)
    }

    FirebaseUploadProductImgs(body: any, params: IParams, File: any, Files: Array<FilePhoto>): Promise<ProductResponse> {
        return firebaseUploadProductsImgs(params.product_id, Files)
    }
    FirebaseDeleteProductImg(body: any, params: any): Promise<ProductResponse> {
        return firebaseDeleteProductImg(params)
    }

    CounterProducts(): Promise<ProductResponse> {
        return counterProducts()
    }

    CounterProductsWithBids(): Promise<ProductResponse> {
        return counterProductsWithBids()
    }
}

export default MainProductUsecases