import { FilePhoto, uploadMultipleImages } from "../../../../utils/Firebase/FirebaseOperations"
import { ProductResponse } from "../../IMainProduct"
import PrismaProductRepositorie from "../../../repositorie/database/PrismaProductRepositorie"

const prismaProduct = new PrismaProductRepositorie()



const firebaseUploadProductsImgs = (product_id: string, Files: Array<FilePhoto>): Promise<ProductResponse> => {

    return new Promise(async (resolve, reject) => {

        try {

            if (!File) return reject({ status_code: 404, body: "Nenhum arquivo enviado" })
            if (!product_id) return reject({ status_code: 403, body: "Nenhum parametro ID foi enviado" })

            const currentProduct = await prismaProduct.find(product_id)
            if (!currentProduct) {
                return reject({ status_code: 404, body: "produto não encontrado" })
            }

            Files.forEach(async (file) => {
                if (file.mimetype !== 'image/png'
                    && file.mimetype !== 'image/jpg'
                    && file.mimetype !== 'image/jpeg') return reject({ status_code: 500, body: "o arquivo precisa ser uma foto" })
            })

            const currentImages: Array<string> = await uploadMultipleImages('aukt-product-imgs', Files)
            await prismaProduct.update({ group_imgs_url: currentImages }, product_id)
            resolve({ status_code: 201, body: { currentImages } })

        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }

    })

}

export default firebaseUploadProductsImgs;