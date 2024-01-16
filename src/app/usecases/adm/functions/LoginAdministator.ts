
import { IAdmin } from "../../../entities/IAdmin"
import PrismaAdminRepositorie from "../../../repositorie/database/PrismaAdminRepositorie"
import { verifyPassword } from "../../../../authentication/Bcrypt"
import { generatedToken } from "../../../../authentication/JWT"
import { AdministratorResponse } from "../../IMainAdministrador"
const prismaAdmin = new PrismaAdminRepositorie()

export const loginAdministator = async (data:Partial<IAdmin>):Promise<AdministratorResponse>=>{

    if(!data.email || !data.password){
        return {
            status_code: 403,
            body: {
                message: "Email and password are required"
            }
        }
    }
    

    try {
        const currentAdmin = await prismaAdmin.findByEmail(data.email) 

        if(!currentAdmin){
            return {
                status_code: 404,
                body: {
                    message: "User not found"
                }
            }
        }

        const verify =await verifyPassword(data.password, currentAdmin.password)
        if(!verify){
            return {
                status_code: 401,
                body: {
                    message: "Invalid password"
                }
            }
        }
        
        const currentToken = await generatedToken(data.email)

        return{
            status_code: 200,
            body: {
                user:currentAdmin,
                token: currentToken
            }
        }
    } catch (error:any) {
        return{status_code:500,body:error}
    }

}