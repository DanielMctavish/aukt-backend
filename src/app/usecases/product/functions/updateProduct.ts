import { IProduct } from "../../../entities/IProduct"
import PrismaProductRepositorie from "../../../repositorie/database/PrismaProductRepositorie"
import { ProductResponse } from "../../IMainProduct"
const prismaProducts = new PrismaProductRepositorie()

export const updateProduct = (data: Partial<IProduct>, advertiser_id: string): Promise<ProductResponse> => {

    return new Promise(async (resolve, reject) => {

        try {

            const currentProduct = await prismaProducts.update(data, advertiser_id)
            if (!currentProduct) {
                return reject({ status_code: 404, body: 'not product founded' })
            }

            resolve({ status_code: 201, body: currentProduct })

        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }

    })

}