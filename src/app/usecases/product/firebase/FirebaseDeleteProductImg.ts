import { AdvertiserResponse } from "../../IMainAdvertiser"
import PrismaProductRepositorie from "../../../repositorie/database/PrismaProductRepositorie"
import { deleteSingleImage } from "../../../../utils/Firebase/FirebaseOperations"

const prismaProduct = new PrismaProductRepositorie()

interface params {
    product_id: string
    url_product: string
}

const firebaseDeleteProductImg = (params: params): Promise<AdvertiserResponse> => {

    return new Promise(async (resolve, reject) => {

        try {
            if (!params.url_product) return reject({ status_code: 500, body: "parâmetro url é necessário!" })

            const currentProduct = await prismaProduct.find(params.product_id)
            const urlImgsGroup = currentProduct?.group_imgs_url

            let verifyUrlGroupChanges = 0
            urlImgsGroup?.map(async (url) => {
                if (url === params.url_product) {
                    verifyUrlGroupChanges++
                    urlImgsGroup.splice(urlImgsGroup.indexOf(url), 1)
                }
            })

            const currentImage = await deleteSingleImage(params.url_product)
            await prismaProduct.update({ cover_img_url: "" }, params.product_id)
            if (verifyUrlGroupChanges > 0) await prismaProduct.update({ group_imgs_url: urlImgsGroup }, params.product_id)

            resolve({ status_code: 200, body: { currentImage } })
        } catch (error: any) {
            reject({ status_code: 500, body: {
                message: error.message
            } })
        }

    })

}

export default firebaseDeleteProductImg;