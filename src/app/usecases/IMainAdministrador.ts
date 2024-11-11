import { FilePhoto } from "../../utils/Firebase/FirebaseOperations"
import { IAdmin } from "../entities/IAdmin"
import { IAdvertiser, PoliceStatus } from "../entities/IAdvertiser"
import { IAuct } from "../entities/IAuct"


export interface AdministratorResponse {
    status_code: number
    body: Object
}

interface params {
    admin_id: string
    email: string
    advertiserId: string
    status: PoliceStatus
}

interface IMainAdministrador {
    CreateAdministrator(data: IAdmin): Promise<AdministratorResponse>
    FindAdministrator(data: any, params: params): Promise<AdministratorResponse>
    FindAdministratorByEmail(data: any, params: params): Promise<AdministratorResponse>
    UpdateAdministrator(data: IAdmin, params: params): Promise<AdministratorResponse>

    FirebaseUploadPhotoProfile(body: any, params: any, File: FilePhoto): Promise<AdministratorResponse>
    FirebaseDeletePhotoProfile(body: any, params: any, File: FilePhoto): Promise<AdministratorResponse>
    LoginAdm(data: Partial<IAdmin>): Promise<AdministratorResponse>
    ListAllAdvertisers(): Promise<AdministratorResponse>
    ListAllAuctions(): Promise<AdministratorResponse>
    UpdateAdvertiserPoliceStatus(body: any, params: params): Promise<AdministratorResponse>
    GetTotalCounts(): Promise<AdministratorResponse>

    ListAllTransactions(data: any, params: params): Promise<AdministratorResponse>
}

export default IMainAdministrador
