import { deleteSingleImage } from "../../../../utils/Firebase/FirebaseOperations";
import PrismaClientRepositorie from "../../../repositorie/database/PrismaClientRepositorie";
import { ClientResponse } from "../../IMainClient";

const prismaClient = new PrismaClientRepositorie()

const firebaseDeleteClientProfile = async (params: any): Promise<ClientResponse> => {

    return new Promise(async (resolve, reject) => {
        try {

            if (!params.url) return reject({ status_code: 500, body: "parâmetro url é necessário!" })
            const currentImage = await deleteSingleImage(params.url)
            await prismaClient.update({ client_url_profile: "" }, params.client_id)
            resolve({ status_code: 200, body: { currentImage } })

        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }
    })

}

export default firebaseDeleteClientProfile;