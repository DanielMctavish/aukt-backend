import { AdministratorResponse } from "../../IMainAdministrador";
import PrismaAdminRepositorie from "../../../repositorie/database/PrismaAdminRepositorie";
import { IAdmin } from "../../../entities/IAdmin";
const prismaAdm = new PrismaAdminRepositorie()

interface params{
    id:string
}

export const updateAdmin = (data:IAdmin, params:params):Promise<AdministratorResponse>=>{
    
    return new Promise((resolve, reject) => {
        try {

            const currentAdm = prismaAdm.update(data, params.id)
            resolve({ status_code: 200, body: currentAdm })

        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }
    })

}
