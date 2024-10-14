import PrismaAdminRepositorie from "../../../repositorie/database/PrismaAdminRepositorie"
import { AdministratorResponse } from "../../IMainAdministrador"

const prismaAdm = new PrismaAdminRepositorie()

export const getTotalCounts = (): Promise<AdministratorResponse> => {
    return new Promise(async (resolve, reject) => {
        try {
            const counts = await prismaAdm.getTotalCounts()
            resolve({ status_code: 200, body: counts })
        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }
    })
}
