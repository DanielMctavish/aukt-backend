import { IProduct } from "../../entities/IProduct";
import IMainProduct, { ProductResponse } from "../IMainProduct";
import { createProduct } from "./functions/createProduct";
import { deleteProduct } from "./functions/deleteProduct";
import { findProduct } from "./functions/findProduct";
import { listProductByAdvertiser } from "./functions/listProductByAdvertiser";
import { updateProduct } from "./functions/updateProduct";

interface params {
    id: string
}
class MainProductUsecases implements IMainProduct {
    create(data: IProduct): Promise<ProductResponse> {
        return createProduct(data)
    }
    find(id: string): Promise<ProductResponse> {
        return findProduct(id)
    }
    listByAdvertiserId(id: string): Promise<ProductResponse> {
        return listProductByAdvertiser(id)
    }
    update(data: Partial<IProduct>, params: params): Promise<ProductResponse> {
        return updateProduct(data, params.id)
    }
    delete(id: string): Promise<ProductResponse> {
        return deleteProduct(id)
    }
}

export default MainProductUsecases