import { IAdvertiser } from "../../entities/IAdvertiser";
import IMainAdvertiser, { AdvertiserResponse } from "../IMainAdvertiser";
import { createAdvertiser } from "./functions/CreateAdvertiser";
import { deleteAdvertiser } from "./functions/DeleteAdvertiser";
import { findAdvertiser } from "./functions/FindAdvertiser";
import { findAdvertiserByEmail } from "./functions/FindAdvertiserByEmail";
import { updateAdvertiser } from "./functions/UpdateAdvertiser";

interface params {
    id: string
}

class MainAdvertiserUsecases implements IMainAdvertiser {
    CreateAdvertiser(data: IAdvertiser): Promise<AdvertiserResponse> {
        return createAdvertiser(data)
    }
    FindAdvertiser(advertiser_id: string): Promise<AdvertiserResponse> {
        return findAdvertiser(advertiser_id)
    }
    FindAdvertiserByEmail(email: string): Promise<AdvertiserResponse> {
        return findAdvertiserByEmail(email)
    }
    UpdateAdvertiser(data: IAdvertiser, params: params): Promise<AdvertiserResponse> {
        return updateAdvertiser(data, params.id)
    }
    DeleteAdvertiser(advertiser_id: string): Promise<AdvertiserResponse> {
        return deleteAdvertiser(advertiser_id)
    }
}

export default MainAdvertiserUsecases