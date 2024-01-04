import { IAdmin } from "../../entities/IAdmin";
import IMainAdministrador, { AdministratorResponse } from "../IMainAdministrador";
import { createAdmin } from "./functions/CreateAdmin";
import { findAdmin } from "./functions/FindAdmin";
import { findAdministratorByEmail } from "./functions/FindByEmail";
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
}

export default MainAdministrator_usecases