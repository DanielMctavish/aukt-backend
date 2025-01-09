import { FilePhoto } from "../../../utils/Firebase/FirebaseOperations";
import { IAuct } from "../../entities/IAuct";
import IMainAuct, { AuctResponse } from "../IMainAuct";
import { counterAucts } from "./functions/CounterAucts";
import { createAuct } from "./functions/CreateAuct";
import { deleteAuct } from "./functions/DeleteAuct";
import { findAuct } from "./functions/FindAuct";
import findAuctByNanoId from "./functions/FindAuctByNanoId";
import { listAuct } from "./functions/ListAucts";
import { listAuctByStatus } from "./functions/ListAuctsByStatus";
import { updateAuct } from "./functions/UpdateAuct";
import firebaseDeleteAuctCover from "./functions/firebase/FirebaseDeleteAuctCover";
import firebaseUploadAuctCover from "./functions/firebase/FirebaseUploadAuctCover";

interface params {
    auct_id: string
    creator_id: string
    client_id:string
    url: string
    nano_id: string
    status: any
}

class MainAuctUsecases implements IMainAuct {
    CreateAuct(data: IAuct): Promise<AuctResponse> {
        return createAuct(data)
    }
    FindAuct(data: any, params: params): Promise<AuctResponse> {
        return findAuct(params.auct_id)
    }
    FindAuctByNanoId(data: any, params: params): Promise<AuctResponse> {
        return findAuctByNanoId(params.nano_id)
    }
    ListAuct(data: any, params: params): Promise<AuctResponse> {
        return listAuct(params)
    }
    ListAuctByStatus(data: any, params: params): Promise<AuctResponse> {
        return listAuctByStatus(params.status)
    }
    UpdateAuct(data: IAuct, params: params): Promise<AuctResponse> {
        return updateAuct(data, params.auct_id)
    }
    DeleteAuct(data: any, params: params): Promise<AuctResponse> {
        return deleteAuct(params.auct_id)
    }

    FirebaseUploadCoverAuct(body: any, params: params, File: FilePhoto): Promise<AuctResponse> {
        return firebaseUploadAuctCover(params.auct_id, File)
    }
    FirebaseDeleteCoverAuct(body: any, params: params, File: FilePhoto): Promise<AuctResponse> {
        return firebaseDeleteAuctCover(params)
    }

    CounterAucts(): Promise<AuctResponse> {
        return counterAucts()
    }
}

export default MainAuctUsecases