import { IAdvertiser } from "../../entities/IAdvertiser";
import IMainAdvertiser, { AdvertiserResponse } from "../IMainAdvertiser";
import { createAdvertiser } from "./functions/CreateAdvertiser";
import { deleteAdvertiser } from "./functions/DeleteAdvertiser";
import { findAdvertiser } from "./functions/FindAdvertiser";
import { findAdvertiserByEmail } from "./functions/FindAdvertiserByEmail";
import { updateAdvertiser } from "./functions/UpdateAdvertiser";

interface params {
    advertiser_id: string
    email: string
}

class MainAdvertiserUsecases implements IMainAdvertiser {
    CreateAdvertiser(data: IAdvertiser): Promise<AdvertiserResponse> {
        return createAdvertiser(data)
    }
    FindAdvertiser(data: any, params: params): Promise<AdvertiserResponse> {
        return findAdvertiser(params.advertiser_id)
    }
    FindAdvertiserByEmail(data: any, params: params): Promise<AdvertiserResponse> {
        return findAdvertiserByEmail(params.email)
    }
    UpdateAdvertiser(data: IAdvertiser, params: params): Promise<AdvertiserResponse> {
        return updateAdvertiser(data, params.advertiser_id)
    }
    DeleteAdvertiser(data: any, params: params): Promise<AdvertiserResponse> {
        return deleteAdvertiser(params.advertiser_id)
    }
}

export default MainAdvertiserUsecases