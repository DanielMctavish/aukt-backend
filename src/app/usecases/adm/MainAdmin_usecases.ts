import { IAdmin } from "../../entities/IAdmin";
import IMainAdministrador, { AdministratorResponse } from "../IMainAdministrador";
import { createAdmin } from "./functions/CreateAdmin";
import { findAdmin } from "./functions/FindAdmin";
import { findAdministratorByEmail } from "./functions/FindByEmail";
import { updateAdmin } from "./functions/UpdateAdmin";

interface params{
    id:string
}

class MainAdministrator_usecases implements IMainAdministrador {

    CreateAdministrator(data: IAdmin): Promise<AdministratorResponse> {
        return createAdmin(data)
    }

    FindAdministrator(adm_id: string): Promise<AdministratorResponse> {
        return findAdmin(adm_id)
    }

    FindAdministratorByEmail(email: string): Promise<AdministratorResponse> { 
        return findAdministratorByEmail(email)
    }

    UpdateAdministrator(data: IAdmin, params: params): Promise<AdministratorResponse> {
       return updateAdmin(data,params)
    }
}

export default MainAdministrator_usecases