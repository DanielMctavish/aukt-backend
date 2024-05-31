import PrismaProductRepositorie from "../../../repositorie/database/PrismaProductRepositorie"
import { ProductResponse } from "../../IMainProduct"
const prismaProducts = new PrismaProductRepositorie()

export const listProductsByOffset = (offset: string): Promise<ProductResponse> => {

    return new Promise(async (resolve, reject) => {

        try {

            const currentProduct = await prismaProducts.list(offset)
            resolve({ status_code: 201, body: currentProduct })

        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }

    })

}