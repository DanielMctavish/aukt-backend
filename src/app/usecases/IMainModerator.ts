import { FilePhoto } from "../../utils/Firebase/FirebaseOperations"
import { IModerator } from "../entities/IModerator"


export interface ModeratorResponse{
    status_code: number
    body: Object
}

interface params {
    moderator_id: string
    email: string
}

interface IMainModerator{
    CreateModerator(data: IModerator): Promise<ModeratorResponse>
    FindModerator(data: any, params: params): Promise<ModeratorResponse>
    FindModeratorByEmail(data: any, params: params): Promise<ModeratorResponse>
    UpdateModerator(data: IModerator, params: params): Promise<ModeratorResponse>
    DeleteModerator(params:params):Promise<ModeratorResponse> 

    LoginModerator(data: Partial<IModerator>): Promise<ModeratorResponse>

    //FIREBASE
    UploadProfile(body: any, params: params, File: FilePhoto): Promise<ModeratorResponse>
    DeleteProfile(body: any, params: params, File: FilePhoto): Promise<ModeratorResponse>

}

export default IMainModerator