import PrismaAdminRepositorie from "../../../repositorie/database/PrismaAdminRepositorie"
import { AdministratorResponse } from "../../IMainAdministrador"
const prismaAdm = new PrismaAdminRepositorie()

export const findAdmin = (admin_id: string): Promise<AdministratorResponse> => {

    return new Promise(async (resolve, reject) => {

        try {
            const currentAdm = await prismaAdm.find(admin_id)
            if (currentAdm)
                resolve({ status_code: 200, body: currentAdm })
        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }

    })

}