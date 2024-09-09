import { FilePhoto } from "../../../utils/Firebase/FirebaseOperations";
import { IAdmin } from "../../entities/IAdmin";
import IMainAdministrador, { AdministratorResponse } from "../IMainAdministrador";
import firebaseDeleteAdmProfile from "./firebase/FirebaseDeleteAdmProfile";
import firebaseUploadAdmProfile from "./firebase/FirebaseUploadAdmProfile";
import { counterAucts } from "../auct/functions/CounterAucts";
import { createAdmin } from "./functions/CreateAdmin";
import { findAdmin } from "./functions/FindAdmin";
import { findAdministratorByEmail } from "./functions/FindByEmail";
import { loginAdministator } from "./functions/LoginAdministator";
import { updateAdmin } from "./functions/UpdateAdmin";

interface params {
    admin_id: string
    email: string
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
}

export default MainAdministrator_usecases