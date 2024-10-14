import PrismaAdminRepositorie from "../../../repositorie/database/PrismaAdminRepositorie"
import { AdministratorResponse } from "../../IMainAdministrador"
import { PoliceStatus } from "../../../entities/IAdvertiser"

const prismaAdm = new PrismaAdminRepositorie()

export const updateAdvertiserPoliceStatus = (advertiserId: string, status: PoliceStatus): Promise<AdministratorResponse> => {

    return new Promise(async (resolve, reject) => {
        try {
            const updatedAdvertiser = await prismaAdm.updateAdvertiserPoliceStatus(advertiserId, status)
            resolve({ status_code: 200, body: updatedAdvertiser })
        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }
    })
    
}
