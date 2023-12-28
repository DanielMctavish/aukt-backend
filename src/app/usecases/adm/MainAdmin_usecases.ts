import { IAdmin } from "../../entities/IAdmin";
import IMainAdministrador, { AdministratorResponse, params } from "../IMainAdministrador";



class MainAdministrator_usecases implements IMainAdministrador {

    CreateAdministrator(data: IAdmin): Promise<AdministratorResponse> {
        
    }

    FindAdministrator(adm_id: string): Promise<AdministratorResponse> {
        
    }
    
    UpdateAdministrator(data: IAdmin, params: params): Promise<AdministratorResponse> {
        
    }
}

export default MainAdministrator_usecases