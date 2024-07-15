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

                const fileSizeInMB = file.size / (1024 * 1024);
                if (fileSizeInMB > 2) {
                    return reject({ status_code: 500, body: "O arquivo é muito grande, máximo 2MB" })
                }
            })

            await uploadMultipleImages('aukt-product-imgs', Files).then(async (images) => {

                console.log("observando Images: ", images)

                await prismaProduct.update({ group_imgs_url: images }, product_id)
                resolve({ status_code: 201, body: { images } })

            })

        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }

    })

}

export default firebaseUploadProductsImgs;