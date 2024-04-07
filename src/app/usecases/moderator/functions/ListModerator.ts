import PrismaModeratorRepositorie from "../../../repositorie/database/PrismaModeratorRepositorie"
import { ModeratorResponse } from "../../IMainModerator"
const moderator = new PrismaModeratorRepositorie()

//list moderator

const listModerator = (): Promise<ModeratorResponse> => {
    return new Promise(async (resolve, reject) => {

        try {
            const verifyModeratorExisted = await moderator.list()
            if (!verifyModeratorExisted) return reject({ status_code: 403, body: { msg:'moderadores não encontrados' } })

            resolve({ status_code: 200, body: { msg:'moderadores encontrados com sucesso', verifyModeratorExisted } })
        } catch (error: any) {

            reject({ status_code: 500, body: error.message })

        }

    })
}

export default listModerator;