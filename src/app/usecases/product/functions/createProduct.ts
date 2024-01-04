import { IProduct } from "../../../entities/IProduct"
import PrismaProductRepositorie from "../../../repositorie/database/PrismaProductRepositorie"
import { ProductResponse } from "../../IMainProduct"
const prismaProducts = new PrismaProductRepositorie()

export const createProduct = (data: IProduct): Promise<ProductResponse> => {

    return new Promise(async (resolve, reject) => {

        try {

            const currentProduct = await prismaProducts.create(data)
            resolve({ status_code: 201, body: currentProduct })

        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }

    })

}