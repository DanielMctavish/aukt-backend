import { AdvertiserResponse } from "../../IMainAdvertiser"
import PrismaAdvertiserRepositorie from "../../../repositorie/database/PrismaAdvertiserRepositorie"
import { deleteSingleImage } from "../../../../utils/Firebase/FirebaseOperations"

const prismaAdvertiser = new PrismaAdvertiserRepositorie()

const firebaseDeleteLogoCompany = (params: any): Promise<AdvertiserResponse> => {

    return new Promise(async (resolve, reject) => {

        try {
            if (!params.url) return reject({ status_code: 500, body: "parâmetro url é necessário!" })

            const currentImage = await deleteSingleImage(params.url)
            await prismaAdvertiser.update(params.id, { url_profile_cover: "" })

            resolve({ status_code: 200, body: { currentImage } })
        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }

    })

}

export default firebaseDeleteLogoCompany;