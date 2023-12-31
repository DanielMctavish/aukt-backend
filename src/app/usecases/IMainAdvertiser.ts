import { IAdvertiser } from "../entities/IAdvertiser"


export interface AdvertiserResponse {
    status_code: number
    body: Object
}

interface params {
    id: string
}

interface IMainAdvertiser {
    CreateAdvertiser(data: IAdvertiser): Promise<AdvertiserResponse>
    FindAdvertiser(advertiser_id: string): Promise<AdvertiserResponse>
    FindAdvertiserByEmail(email:string): Promise<AdvertiserResponse>
    UpdateAdvertiser(data: IAdvertiser, params: params): Promise<AdvertiserResponse>
    DeleteAdvertiser(advertiser_id: string): Promise<AdvertiserResponse>

    // FirebaseUploadPhotoProfile(body: any, params: any, File: FilePhoto): Promise<AdministratorResponse>
    // FirebaseDeletePhotoProfile(body: any, params: any, File: FilePhoto): Promise<AdministratorResponse>
}

export default IMainAdvertiser