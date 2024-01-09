import { IProduct } from "../../entities/IProduct";
import IMainProduct, { ProductResponse } from "../IMainProduct";
import { createProduct } from "./functions/createProduct";
import { deleteProduct } from "./functions/deleteProduct";
import { findProduct } from "./functions/findProduct";
import { listProductByAdvertiser } from "./functions/listProductByAdvertiser";
import { updateProduct } from "./functions/updateProduct";

interface params {
    product_id: string
    advertiser_id:string
}
class MainProductUsecases implements IMainProduct {
    create(data: IProduct): Promise<ProductResponse> {
        return createProduct(data)
    }
    find(data: any, params: params): Promise<ProductResponse> {
        return findProduct(params.product_id)
    }
    listByAdvertiserId(data: any, params: params): Promise<ProductResponse> {
        return listProductByAdvertiser(params.advertiser_id)
    }
    update(data: Partial<IProduct>, params: params): Promise<ProductResponse> {
        return updateProduct(data, params.product_id)
    }
    delete(data: any, params: params): Promise<ProductResponse> {
        return deleteProduct(params.product_id)
    }
}

export default MainProductUsecases