import { IAdvertiser } from "../entities/IAdvertiser"


export interface AdvertiserResponse {
    status_code: number
    body: Object
}

interface params {
    advertiser_id: string
    email: string
}

interface IMainAdvertiser {
    CreateAdvertiser(data: IAdvertiser): Promise<AdvertiserResponse>
    FindAdvertiser(data: any, params: params): Promise<AdvertiserResponse>
    FindAdvertiserByEmail(data: any, params: params): Promise<AdvertiserResponse>
    UpdateAdvertiser(data: IAdvertiser, params: params): Promise<AdvertiserResponse>
    DeleteAdvertiser(data: any, params: params): Promise<AdvertiserResponse>

    // FirebaseUploadPhotoProfile(body: any, params: any, File: FilePhoto): Promise<AdministratorResponse>
    // FirebaseDeletePhotoProfile(body: any, params: any, File: FilePhoto): Promise<AdministratorResponse>
}

export default IMainAdvertiser