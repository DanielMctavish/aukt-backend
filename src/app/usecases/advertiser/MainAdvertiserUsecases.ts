import { FilePhoto } from "../../../utils/Firebase/FirebaseOperations";
import { IAdvertiser } from "../../entities/IAdvertiser";
import IMainAdvertiser, { AdvertiserResponse } from "../IMainAdvertiser";
import firebaseDeleteAdvertiserProfile from "./firebase/FirebaseDeleteAdvertiserProfile";
import firebaseDeleteLogoCompany from "./firebase/FirebaseDeleteLogoCompany";
import firebaseUploadAdvertiserProfile from "./firebase/FirebaseUploadAdvertiserProfile";
import firebaseUploadCompanyLogo from "./firebase/FirebaseUploadCompanyLogo";
import { createAdvertiser } from "./functions/CreateAdvertiser";
import { deleteAdvertiser } from "./functions/DeleteAdvertiser";
import { findAdvertiser } from "./functions/FindAdvertiser";
import { findAdvertiserByEmail } from "./functions/FindAdvertiserByEmail";
import { loginAdvertiser } from "./functions/LoginAdvertiser";
import { updateAdvertiser } from "./functions/UpdateAdvertiser";

interface params {
    url: string
    advertiserId: string
    email: string
}

class MainAdvertiserUsecases implements IMainAdvertiser {
    CreateAdvertiser(data: IAdvertiser): Promise<AdvertiserResponse> {
        return createAdvertiser(data)
    }
    FindAdvertiser(data: any, params: params): Promise<AdvertiserResponse> {
        return findAdvertiser(params.advertiserId)
    }
    FindAdvertiserByEmail(data: any, params: params): Promise<AdvertiserResponse> {
        return findAdvertiserByEmail(params.email)
    }
    UpdateAdvertiser(data: IAdvertiser, params: params): Promise<AdvertiserResponse> {
        return updateAdvertiser(data, params.advertiserId)
    }
    DeleteAdvertiser(data: any, params: params): Promise<AdvertiserResponse> {
        return deleteAdvertiser(params.advertiserId)
    }

    LoginAdvertiser(data: Partial<IAdvertiser>): Promise<AdvertiserResponse> {
        return loginAdvertiser(data)
    }

    //FIREBASE USECASES
    FirebaseUploadLogoCompany(body: any, params: params, File: FilePhoto): Promise<AdvertiserResponse> {
        return firebaseUploadCompanyLogo(params.advertiserId, File)
    }
    FirebaseDeleteLogoCompany(body: any, params: params, File: FilePhoto): Promise<AdvertiserResponse> {
        return firebaseDeleteLogoCompany(params)
    }
    FirebaseUploadPhotoProfile(body: any, params: params, File: FilePhoto): Promise<AdvertiserResponse> {
        return firebaseUploadAdvertiserProfile(params.advertiserId, File)
    }
    FirebaseDeletePhotoProfile(body: any, params: params, File: FilePhoto): Promise<AdvertiserResponse> {
        return firebaseDeleteAdvertiserProfile(params)
    }
}

export default MainAdvertiserUsecases