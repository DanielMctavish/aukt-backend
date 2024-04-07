import { AdvertiserResponse } from "../../IMainAdvertiser"
import PrismaAdminRepositorie from "../../../repositorie/database/PrismaAdminRepositorie"
import { deleteSingleImage } from "../../../../utils/Firebase/FirebaseOperations"

const prismaAdmin = new PrismaAdminRepositorie()

const firebaseDeleteAdmProfile = (params: any): Promise<AdvertiserResponse> => {

    return new Promise(async (resolve, reject) => {

        try {
            if (!params.url) return reject({ status_code: 500, body: "parâmetro url é necessário!" })

            const currentImage = await deleteSingleImage(params.url)
            await prismaAdmin.update({ admin_url_profile: "" }, params.admin_id)

            resolve({ status_code: 200, body: { currentImage } })
        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }

    })

}

export default firebaseDeleteAdmProfile;