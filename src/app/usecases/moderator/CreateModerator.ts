import { IModerator } from "../../entities/IModerator"
import bcrypt from "bcrypt"
import PrismaModeratorRepositorie from "../../repositorie/database/PrismaModeratorRepositorie"
import { ModeratorResponse } from "../IMainModerator"
const moderator = new PrismaModeratorRepositorie()

const createModerator = (data: IModerator): Promise<ModeratorResponse> => {

    return new Promise(async (resolve, reject) => {

        try {
            const verifyModeratorExisted = await moderator.findByEmail(data.email)
            if (verifyModeratorExisted) return reject({ status_code: 403, body: { msg: 'este moderador já existe' } })

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(data.password, salt)

            const currentModerator = await moderator.create({ ...data, password: hash })
            resolve({ status_code: 200, body: { msg: 'moderador criado com sucesso', currentModerator } })
        } catch (error: any) {

            reject({ status_code: 500, body: error.message })

        }

    })

}

export default createModerator