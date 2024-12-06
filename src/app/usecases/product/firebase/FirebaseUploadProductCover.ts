import { FilePhoto, uploadSingleImage } from "../../../../utils/Firebase/FirebaseOperations"
import { ProductResponse } from "../../IMainProduct"
import PrismaProductRepositorie from "../../../repositorie/database/PrismaProductRepositorie"

const prismaProduct = new PrismaProductRepositorie()



const firebaseUploadProductCover = (product_id: string, File: FilePhoto): Promise<ProductResponse> => {

    return new Promise(async (resolve, reject) => {

        try {
            if (!File) return reject({ status_code: 404, body: "Nenhum arquivo enviado" })
            if (!product_id) return reject({ status_code: 403, body: "Nenhum parametro ID foi enviado" })

            if (File.mimetype !== 'image/png'
                && File.mimetype !== 'image/jpg'
                && File.mimetype !== 'image/jpeg') return reject({ status_code: 500, body: "o arquivo precisa ser uma foto" })


            const currentProduct = await prismaProduct.find({product_id})
            if (!currentProduct) {
                return reject({ status_code: 404, body: "produto não encontrado" })
            }

            const fileSizeInMB = File.size / (2048 * 2048);
            if (fileSizeInMB > 2) {
                return reject({ status_code: 500, body: "O arquivo é muito grande, máximo 4MB" })
            }

            const currentImage = await uploadSingleImage('aukt-product-cover', File)
            await prismaProduct.update({ cover_img_url: currentImage }, product_id)

            resolve({ status_code: 201, body: { currentImage } })
        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }

    })

}

export default firebaseUploadProductCover;