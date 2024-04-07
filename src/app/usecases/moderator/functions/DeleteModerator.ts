import PrismaModeratorRepositorie from "../../../repositorie/database/PrismaModeratorRepositorie"
import { ModeratorResponse } from "../../IMainModerator"
const moderator = new PrismaModeratorRepositorie()

//delete moderator usecase
const deleteModerator = (moderator_id: string): Promise<ModeratorResponse> => {

    return new Promise(async (resolve, reject) => {

        try {
            const verifyModeratorExisted = await moderator.find(moderator_id)
            if (!verifyModeratorExisted) return reject({ status_code: 403, body: { msg:'moderador não existe' } })

            const deletedModerator = await moderator.delete(moderator_id)
            resolve({ status_code: 200, body: { msg:'moderador deletado com sucesso', deletedModerator } })
        } catch (error: any) {

            reject({ status_code: 500, body: error.message })

        }

    })

}

export default deleteModerator