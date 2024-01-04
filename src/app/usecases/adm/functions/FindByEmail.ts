import PrismaAdminRepositorie from "../../../repositorie/database/PrismaAdminRepositorie"
import { AdministratorResponse } from "../../IMainAdministrador"
const prismaAdm = new PrismaAdminRepositorie()

export const findAdministratorByEmail = (email: string): Promise<AdministratorResponse> => {

    return new Promise(async (resolve, reject) => {

        try {
            const currentAdm = await prismaAdm.findByEmail(email)
            if (currentAdm)
                resolve({ status_code: 200, body: !currentAdm ? "not adm founded" : currentAdm })
        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }

    })

}