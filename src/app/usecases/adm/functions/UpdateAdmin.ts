import { AdministratorResponse } from "../../IMainAdministrador";
import PrismaAdminRepositorie from "../../../repositorie/database/PrismaAdminRepositorie";
import { IAdmin } from "../../../entities/IAdmin";
const prismaAdm = new PrismaAdminRepositorie()


export const updateAdmin = (data: IAdmin, admin_id: string): Promise<AdministratorResponse> => {

    return new Promise(async (resolve, reject) => {

        try {

            const currentAdm = await prismaAdm.update(data, admin_id)
            if (currentAdm)
                resolve({ status_code: 200, body: currentAdm })

        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }
    })

}
