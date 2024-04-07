import PrismaClientRepositorie from "../../../repositorie/database/PrismaClientRepositorie"
import { verifyPassword } from "../../../../authentication/Bcrypt"
import { generatedToken } from "../../../../authentication/JWT"
import { IClient } from "../../../entities/IClient"
import { ClientResponse } from "../../IMainClient"

const prismaClient = new PrismaClientRepositorie()

export const loginClient = async (data:Partial<IClient>):Promise<ClientResponse>=>{

    if(!data.email || !data.password){
        return {
            status_code: 403,
            body: {
                message: "Email and password are required"
            }
        }
    }
    

    try {
        const currentClient = await prismaClient.findByEmail(data.email) 

        if(!currentClient){
            return {
                status_code: 404,
                body: {
                    message: "User not found"
                }
            }
        }

        const verify =await verifyPassword(data.password, currentClient.password)
        if(!verify){
            return {
                status_code: 403,
                body: {
                    message: "Invalid password"
                }
            }
        }
        
        const currentToken = await generatedToken(data.email)

        return{
            status_code: 200,
            body: {
                user:currentClient,
                token: currentToken
            }
        }
    } catch (error:any) {
        return{status_code:500,body:error}
    }

}