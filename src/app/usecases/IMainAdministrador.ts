import { IAdmin } from "../entities/IAdmin"


export interface AdministratorResponse {
    status_code: number
    body: Object
}

export interface params {
    id: string
}

interface IMainAdministrador {
    CreateAdministrator(data: IAdmin): Promise<AdministratorResponse>
    FindAdministrator(adm_id: string): Promise<AdministratorResponse>
    UpdateAdministrator(data: IAdmin, params: params): Promise<AdministratorResponse>


    // FirebaseUploadPhotoProfile(body: any, params: any, File: FilePhoto): Promise<AdministratorResponse>
    // FirebaseDeletePhotoProfile(body: any, params: any, File: FilePhoto): Promise<AdministratorResponse>
}

export default IMainAdministrador