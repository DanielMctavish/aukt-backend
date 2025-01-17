import firebase from "firebase-admin"
import firebaseKey from "./auk-plataform-firebase-adminsdk-0a10n-8d927c792a.json"
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

const bucket = firebase.storage().bucket("gs://auk-plataform.appspot.com")

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


export async function uploadMultipleImages(folderType: string, files: Array<FilePhoto>): Promise<Array<string>> {
    const urlFiles: Array<string> = [];

    return new Promise(async (resolve) => {
        for (const file of files) {
            const fileRef = bucket.file(`${folderType}/${v4()}_${file.originalname}`);

            await fileRef.save(file.buffer, {
                metadata: {
                    contentType: file.mimetype,
                },
            });

            await fileRef.makePublic();
            urlFiles.push(`https://storage.googleapis.com/${bucket.name}/${fileRef.name}`);
        }

        resolve(urlFiles);
    });
}


export async function deleteSingleImage(url: string) {
    
    try {
        // Remove a parte inicial da URL até o nome do bucket
        const urlParts = url.split('auk-plataform.appspot.com/');
        if (urlParts.length < 2) {
            console.log('URL inválida:', url);
            return;
        }

        const filePath = urlParts[1]; // Pega apenas o caminho do arquivo
        const currentUrlFile = bucket.file(filePath);
        
        await currentUrlFile.delete();
        return { msg: 'imagem excluída' };
    } catch (error: any) {
        // Se o arquivo não existir, apenas retorna silenciosamente
        if (error.code === 404 || error.message.includes('No such object')) {
            return;
        }
        // Para outros tipos de erro, loga e continua
        console.error('Erro ao excluir a imagem:', error.message);
    }
    
}


