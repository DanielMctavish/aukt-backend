import PrismaAdminRepositorie from "../../../repositorie/database/PrismaAdminRepositorie"
import { AdministratorResponse } from "../../IMainAdministrador"

const prismaAdm = new PrismaAdminRepositorie()

export const listAllAdvertisers = (): Promise<AdministratorResponse> => {
    return new Promise(async (resolve, reject) => {
        try {
            const advertisers = await prismaAdm.listAllAdvertisers()
            resolve({ status_code: 200, body: advertisers })
        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }
    })
}
