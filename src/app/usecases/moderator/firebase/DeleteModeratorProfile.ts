import { deleteSingleImage } from "../../../../utils/Firebase/FirebaseOperations"
import PrismaModeratorRepositorie from "../../../repositorie/database/PrismaModeratorRepositorie"
import { ModeratorResponse } from "../../IMainModerator"
const prismaModerator = new PrismaModeratorRepositorie()

const deleteModeratorProfile = (params: any):Promise<ModeratorResponse> => {

    return new Promise(async (resolve, reject) => {

        try {
            if (!params.url) return reject({ status_code: 500, body: "parâmetro url é necessário!" })
            if(!params.moderator_id){
                return reject({ status_code: 403, body: "parâmetro moderator_id é necessário!" })
            }

            const currentImage = await deleteSingleImage(params.url)
            await prismaModerator.update({ moderator_url_profile: "" }, params.moderator_id)

            resolve({ status_code: 200, body: { currentImage } })
        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }

    })

}

export default deleteModeratorProfile;