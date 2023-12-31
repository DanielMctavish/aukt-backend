import { IAuct } from "../../entities/IAuct";
import IMainAuct, { AuctResponse } from "../IMainAuct";
import { createAuct } from "./functions/CreateAuct";
import { deleteAuct } from "./functions/DeleteAuct";
import { findAuct } from "./functions/FindAuct";
import { listAuct } from "./functions/ListAucts";
import { updateAuct } from "./functions/UpdateAuct";


class MainAuctUsecases implements IMainAuct {
    CreateAuct(data: IAuct): Promise<AuctResponse> {
        return createAuct(data)
    }
    FindAuct(auct: Partial<IAuct>): Promise<AuctResponse> {
        return findAuct(auct)
    }
    ListAuct(auct: Partial<IAuct>): Promise<AuctResponse> {
        return listAuct(auct)
    }
    UpdateAuct(data: IAuct, auct: Partial<IAuct>): Promise<AuctResponse> {
        return updateAuct(data, auct)
    }
    DeleteAuct(auct: Partial<IAuct>): Promise<AuctResponse> {
        return deleteAuct(auct)
    }
}

export default MainAuctUsecases