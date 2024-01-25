import { IModerator } from "../../../entities/IModerator"
import PrismaModeratorRepositorie from "../../../repositorie/database/PrismaModeratorRepositorie"
import { ModeratorResponse } from "../../IMainModerator"
const moderator = new PrismaModeratorRepositorie()


const updateModerator = (data: IModerator, moderator_id: string): Promise<ModeratorResponse> => {

    return new Promise(async (resolve, reject) => {

        try {
            const verifyModeratorExisted = await moderator.update(data, moderator_id)
            if (!verifyModeratorExisted) return reject({ status_code: 403, body: { msg:'moderador não encontrado' } })

            resolve({ status_code: 200, body: { msg:'moderador atualizado com sucesso', verifyModeratorExisted } })
        } catch (error: any) {

            reject({ status_code: 500, body: error.message })

        }

    })
    
}

export default updateModerator;