import { IAdvertiser } from "../../../entities/IAdvertiser"
import PrismaAdvertiserRepositorie from "../../../repositorie/database/PrismaAdvertiserRepositorie"
import { AdvertiserResponse } from "../../IMainAdvertiser"
import { verifyPassword } from "../../../../authentication/Bcrypt"
import { generatedToken } from "../../../../authentication/JWT"
const prismaAdvertiser = new PrismaAdvertiserRepositorie()

export const loginAdvertiser = async (data:Partial<IAdvertiser>):Promise<AdvertiserResponse>=>{

    if(!data.email || !data.password){
        return {
            status_code: 403,
            body: {
                message: "Email and password are required"
            }
        }
    }
    

    try {
        const currentAdvertiser = await prismaAdvertiser.findByEmail(data.email) 

        if(!currentAdvertiser){
            return {
                status_code: 404,
                body: {
                    message: "User not found"
                }
            }
        }

        const verify =await verifyPassword(data.password, currentAdvertiser.password)
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
                user:currentAdvertiser,
                token: currentToken
            }
        }
    } catch (error:any) {
        return{status_code:500,body:error}
    }

}