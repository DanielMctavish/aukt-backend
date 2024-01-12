import { IAdmin } from "../entities/IAdmin"


export interface AdministratorResponse {
    status_code: number
    body: Object
}

interface params {
    admin_id: string
    email: string
}

interface IMainAdministrador {
    CreateAdministrator(data: IAdmin): Promise<AdministratorResponse>
    FindAdministrator(data: any, params: params): Promise<AdministratorResponse>
    FindAdministratorByEmail(data: any, params: params): Promise<AdministratorResponse>
    UpdateAdministrator(data: IAdmin, params: params): Promise<AdministratorResponse>

    // FirebaseUploadPhotoProfile(body: any, params: any, File: FilePhoto): Promise<AdministratorResponse>
    // FirebaseDeletePhotoProfile(body: any, params: any, File: FilePhoto): Promise<AdministratorResponse>
    LoginAdm(data: Partial<IAdmin>): Promise<AdministratorResponse>
}

export default IMainAdministrador