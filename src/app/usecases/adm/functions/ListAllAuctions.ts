import PrismaAdminRepositorie from "../../../repositorie/database/PrismaAdminRepositorie"
import { AdministratorResponse } from "../../IMainAdministrador"

const prismaAdm = new PrismaAdminRepositorie()

export const listAllAuctions = (): Promise<AdministratorResponse> => {
    return new Promise(async (resolve, reject) => {
        try {
            const auctions = await prismaAdm.listAllAuctions()
            resolve({ status_code: 200, body: auctions })
        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }
    })
}
