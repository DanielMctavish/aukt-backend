import { verifyPassword } from "../../../../authentication/Bcrypt"
import { generatedToken } from "../../../../authentication/JWT"
import { IModerator } from "../../../entities/IModerator"
import PrismaModeratorRepositorie from "../../../repositorie/database/PrismaModeratorRepositorie"
import { ModeratorResponse } from "../../IMainModerator"
const prismaModerator = new PrismaModeratorRepositorie()


const LoginModerator = async (data:Partial<IModerator>):Promise<ModeratorResponse> => {

    if (!data.email || !data.password) {
        return {
            status_code: 403,
            body: {
                message: "Email and password are required"
            }
        }
    }

    try {
        const currentModerator = await prismaModerator.findByEmail(data.email)

        if (!currentModerator) {
            return {
                status_code: 404,
                body: {
                    message: "User not found"
                }
            }
        }

        const verify = await verifyPassword(data.password, currentModerator.password)
        if (!verify) {
            return {
                status_code: 401,
                body: {
                    message: "Invalid password"
                }
            }
        }

        const currentToken = await generatedToken(data.email)

        return {
            status_code: 200,
            body: {
                user: currentModerator,
                token: currentToken
            }
        }
    } catch (error: any) {
        return { status_code: 500, body: error }
    }

}

export default LoginModerator;