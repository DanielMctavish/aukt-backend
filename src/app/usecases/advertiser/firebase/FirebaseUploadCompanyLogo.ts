import { FilePhoto, uploadSingleImage } from "../../../../utils/Firebase/FirebaseOperations"
import { AdvertiserResponse } from "../../IMainAdvertiser"

const firebaseUploadCompanyLogo = (user_id: string, File: FilePhoto): Promise<AdvertiserResponse> => {
    //console.log('dentro da função de upload --> ', File);
    return new Promise(async (resolve, reject) => {
        try {
            if (!File) return reject({ status_code: 404, body: "Nenhum arquivo enviado" })
            //if (!user_id) return reject({ status_code: 403, body: "Nenhum parametro ID foi enviado" })
            if (File.mimetype !== 'image/png'
                && File.mimetype !== 'image/jpg'
                && File.mimetype !== 'image/jpeg') return reject({ status_code: 500, body: "o arquivo precisa ser uma foto" })

            const currentImage = await uploadSingleImage('firebase-company-logo', File)
            resolve({ status_code: 201, body: { currentImage } })
        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }

    })

}

export default firebaseUploadCompanyLogo;