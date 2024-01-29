import { FilePhoto } from "../../../utils/Firebase/FirebaseOperations";
import { IModerator } from "../../entities/IModerator";
import IMainModerator, { ModeratorResponse } from "../IMainModerator";
import deleteModeratorProfile from "./firebase/DeleteModeratorProfile";
import uploadModeratorProfile from "./firebase/UploadModeratorProfile";
import createModerator from "./functions/CreateModerator";
import deleteModerator from "./functions/DeleteModerator";
import findModerator from "./functions/FindModerator";
import findModeratorByEmail from "./functions/FindModeratorByEmail";
import LoginModerator from "./functions/LoginModerator";
import updateModerator from "./functions/UpdateModerator";


interface params {
  moderator_id: string
  email: string
}

class MainModerator implements IMainModerator {

  CreateModerator(data: IModerator): Promise<ModeratorResponse> {
    return createModerator(data)
  }
  FindModerator(data: any, params: params): Promise<ModeratorResponse> {
    return findModerator(params.moderator_id)
  }
  FindModeratorByEmail(data: any, params: params): Promise<ModeratorResponse> {
    return findModeratorByEmail(params.email)
  }
  UpdateModerator(data: IModerator, params: params): Promise<ModeratorResponse> {
    return updateModerator(data, params.moderator_id)
  }
  DeleteModerator(params: params): Promise<ModeratorResponse> {
    return deleteModerator(params.moderator_id)
  }

  LoginModerator(data: Partial<IModerator>): Promise<ModeratorResponse> {
    return LoginModerator(data)
  }

  UploadProfile(body: any, params: params, File: FilePhoto): Promise<ModeratorResponse> {
    return uploadModeratorProfile(params.moderator_id, File)
  }
  DeleteProfile(body: any, params: params, File: FilePhoto): Promise<ModeratorResponse> {
    return deleteModeratorProfile(params)
  }

}

export default MainModerator;