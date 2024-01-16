import firebase from "firebase-admin"
import firebaseKey from "./flashprev-files-firebase-adminsdk-m9cih-3f0803c29a.json"
import { v4 } from "uuid"

firebase.initializeApp({
    credential: firebase.credential.cert({
        clientEmail: firebaseKey.client_email,
        privateKey: firebaseKey.private_key,
        projectId: firebaseKey.project_id
    })
})

export interface FilePhoto {
    fieldname: string,
    originalname: string,
    encoding: string,
    mimetype: string,
    buffer: Buffer,
    size: number
}

const bucket = firebase.storage().bucket("gs://aukt-images.appspot.com")

//upload a single image
export async function uploadSingleImage(folderType: string, file: FilePhoto): Promise<string> {
    const fileRef = bucket.file(`${folderType}/${v4()}_${file.originalname}`)
    await fileRef.save(file.buffer, {
        metadata: {
            contentType: file.mimetype
        }
    })

    await fileRef.makePublic()
    const currentUrl = `https://storage.googleapis.com/${bucket.name}/${fileRef.name}`;

    return currentUrl;
}
//upload multiple images

export async function uploadMultipleImages(folderType: string, files: Array<FilePhoto>): Promise<Array<string>> {
    const promises = files.map(async (file) => {
        const fileRef = bucket.file(`${folderType}/${v4()}_${file.originalname}`)
        await fileRef.save(file.buffer, {
            metadata: {
                contentType: file.mimetype
            }
        })

        await fileRef.makePublic()
        const currentUrl = `https://storage.googleapis.com/${bucket.name}/${fileRef.name}`;

        return currentUrl;
    })

    return Promise.all(promises)
}   


export async function deleteSingleImage(url: string) {
    try {
        const currentUrlFile = bucket.file(url.replace(`https://storage.googleapis.com/${bucket.name}/`, ''));
        const currentUrl = await currentUrlFile.delete();
        return { msg: 'imagem excluída', currentUrl }
    } catch (error: any) {
        console.error('Erro ao excluir a imagem:', error.message);
        throw error;
    }
}


