import PrismaModeratorRepositorie from "../../repositorie/database/PrismaModeratorRepositorie"
import { ModeratorResponse } from "../IMainModerator"
const moderator = new PrismaModeratorRepositorie()

//find moderator by email


const findModeratorByEmail = (email: string): Promise<ModeratorResponse> => {
    return new Promise(async (resolve, reject) => {

        try {
            const verifyModeratorExisted = await moderator.find(email)
            if (!verifyModeratorExisted) return reject({ status_code: 403, body: { msg:'moderador não existe' } })

            resolve({ status_code: 200, body: { msg:'moderador encontrado com sucesso', verifyModeratorExisted } })
        } catch (error: any) {

            reject({ status_code: 500, body: error.message })

        }

    })
}

export default findModeratorByEmail;