import { FilePhoto, uploadSingleImage } from "../../../../utils/Firebase/FirebaseOperations";
import { ClientResponse } from "../../IMainClient";
import PrismaClientRepositorie from "../../../repositorie/database/PrismaClientRepositorie";

const prismaClient = new PrismaClientRepositorie()


const firebaseUploadClientProfile = (client_id: string, File: FilePhoto): Promise<ClientResponse> => {

    return new Promise(async (resolve, reject) => {

        try {

            if (!File) return reject({ status_code: 404, body: "Nenhum arquivo enviado" })
            if (!client_id) return reject({ status_code: 403, body: "Nenhum parametro ID foi enviado" })

            const currentClient = await prismaClient.find(client_id)
            if (!currentClient) {
                return reject({ status_code: 404, body: "Usuário não encontrado" })
            }

            if (File.mimetype !== 'image/png'
                && File.mimetype !== 'image/jpg'
                && File.mimetype !== 'image/jpeg') return reject({ status_code: 500, body: "o arquivo precisa ser uma foto" })

            const currentImage = await uploadSingleImage('firebase-client-profile', File)
            await prismaClient.update({ client_url_profile: currentImage }, client_id)

            resolve({ status_code: 201, body: { currentImage } })

        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }

    })

}

export default firebaseUploadClientProfile; 