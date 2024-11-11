import { FilePhoto } from "../../../utils/Firebase/FirebaseOperations";
import { IAdmin } from "../../entities/IAdmin";
import { PoliceStatus } from "../../entities/IAdvertiser";
import IMainAdministrador, { AdministratorResponse } from "../IMainAdministrador";
import firebaseDeleteAdmProfile from "./firebase/FirebaseDeleteAdmProfile";
import firebaseUploadAdmProfile from "./firebase/FirebaseUploadAdmProfile";
import { counterAucts } from "../auct/functions/CounterAucts";
import { createAdmin } from "./functions/CreateAdmin";
import { findAdmin } from "./functions/FindAdmin";
import { findAdministratorByEmail } from "./functions/FindByEmail";
import { loginAdministator } from "./functions/LoginAdministator";
import { updateAdmin } from "./functions/UpdateAdmin";
import { listAllAdvertisers } from "./functions/ListAllAdvertisers";
import { listAllAuctions } from "./functions/ListAllAuctions";
import { updateAdvertiserPoliceStatus } from "./functions/UpdateAdvertiserPoliceStatus";
import { getTotalCounts } from "./functions/GetTotalCounts";
import listAllTransactions from "./functions/ListAllTransactions";

interface params {
    admin_id: string
    email: string
    advertiserId: string
    status: PoliceStatus
}

class MainAdministrator_usecases implements IMainAdministrador {

    CreateAdministrator(data: IAdmin): Promise<AdministratorResponse> {
        return createAdmin(data)
    }

    FindAdministrator(data: any, params: params): Promise<AdministratorResponse> {
        return findAdmin(params.admin_id)
    }

    FindAdministratorByEmail(data: any, params: params): Promise<AdministratorResponse> {
        return findAdministratorByEmail(params.email)
    }

    UpdateAdministrator(data: IAdmin, params: params): Promise<AdministratorResponse> {
        return updateAdmin(data, params.admin_id)
    }

    LoginAdm(data: Partial<IAdmin>): Promise<AdministratorResponse> {
        return loginAdministator(data)
    }

    FirebaseUploadPhotoProfile(body: any, params: any, File: FilePhoto): Promise<AdministratorResponse> {
        return firebaseUploadAdmProfile(params.admin_id, File)
    }
    FirebaseDeletePhotoProfile(body: any, params: any, File: FilePhoto): Promise<AdministratorResponse> {
        return firebaseDeleteAdmProfile(params)
    }

    CounterAucts(): Promise<AdministratorResponse> {
        return counterAucts()
    }

    ListAllAdvertisers(): Promise<AdministratorResponse> {
        return listAllAdvertisers();
    }

    ListAllAuctions(): Promise<AdministratorResponse> {
        return listAllAuctions();
    }

    UpdateAdvertiserPoliceStatus(body: any, params: params): Promise<AdministratorResponse> {
        return updateAdvertiserPoliceStatus(params.advertiserId, params.status);
    }

    GetTotalCounts(): Promise<AdministratorResponse> {
        return getTotalCounts();
    }

    ListAllTransactions(data: any, params: params): Promise<AdministratorResponse> {
        return listAllTransactions(params.advertiserId)
    }
}

export default MainAdministrator_usecases
