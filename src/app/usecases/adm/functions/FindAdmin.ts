import PrismaAdminRepositorie from "../../../repositorie/database/PrismaAdminRepositorie"
import { AdministratorResponse } from "../../IMainAdministrador"
const prismaAdm = new PrismaAdminRepositorie()

export const findAdmin = (adm_id:string):Promise<AdministratorResponse>=>{

    return new Promise((resolve, reject) => {
        try {
            const currentAdm = prismaAdm.find(adm_id)
            resolve({ status_code: 200, body: currentAdm })
        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }
    })

}