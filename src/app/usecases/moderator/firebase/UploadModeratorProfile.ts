import { FilePhoto, uploadSingleImage } from "../../../../utils/Firebase/FirebaseOperations"
import PrismaModeratorRepositorie from "../../../repositorie/database/PrismaModeratorRepositorie"
import { ModeratorResponse } from "../../IMainModerator"
const prismaModerator = new PrismaModeratorRepositorie()

const uploadModeratorProfile = (moderator_id: string, File: FilePhoto): Promise<ModeratorResponse> => {

    return new Promise(async (resolve, reject) => {

        try {

            if (!File) return reject({ status_code: 403, body: "Nenhum arquivo enviado" })
            if (!moderator_id) return reject({ status_code: 403, body: "Nenhum parametro ID foi enviado" })

            const currentClient = await prismaModerator.find(moderator_id)
            if (!currentClient) {
                return reject({ status_code: 404, body: "Usuário não encontrado" })
            }

            if (File.mimetype !== 'image/png'
                && File.mimetype !== 'image/jpg'
                && File.mimetype !== 'image/jpeg') return reject({ status_code: 500, body: "o arquivo precisa ser uma foto" })

            const currentImage = await uploadSingleImage('aukt-profile-moderator', File)
            await prismaModerator.update({ moderator_url_profile: currentImage }, moderator_id)

            resolve({ status_code: 201, body: { currentImage } })

        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }

    })

}

export default uploadModeratorProfile;