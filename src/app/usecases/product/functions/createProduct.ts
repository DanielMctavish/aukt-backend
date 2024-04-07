import { IProduct } from "../../../entities/IProduct"
import PrismaProductRepositorie from "../../../repositorie/database/PrismaProductRepositorie"
import PrismaAuctRepositorie from "../../../repositorie/database/PrismaAuctRepositorie"
import { ProductResponse } from "../../IMainProduct"
const prismaProducts = new PrismaProductRepositorie()
const prismaAuct = new PrismaAuctRepositorie()

export const createProduct = (data: IProduct): Promise<ProductResponse> => {

    return new Promise(async (resolve, reject) => {

        try {

            if (!data.auct_nanoid || !data.auct_id) {
                return reject({ status_code: 404, body: "no ID's auct sended" })
            }

            const getAuct = await prismaAuct.findByNanoId(data.auct_nanoid)
            if (!getAuct) {
                return reject({ status_code: 404, body: "not auct founded" })
            }

            const currentProduct = await prismaProducts.create(data)
            resolve({ status_code: 201, body: currentProduct })

        } catch (error: any) {
            //console.log('erro ao criar produto >> ', error);
            
            reject({ status_code: 500, body: error })
        }

    })

}