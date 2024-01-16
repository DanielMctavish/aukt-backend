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
}

export default IMainModerator