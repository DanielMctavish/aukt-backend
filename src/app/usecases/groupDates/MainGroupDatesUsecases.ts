import { AuctDateGroups } from "@prisma/client";
import IMainGroupDates, { GroupDatesResponse } from "../IMainGroupDates";
import { ChangeGroupDatesStatus } from "./ChangeGroupDatesStatus";

interface params {
    auct_date_id: string
}

class MainGroupDatesUsecases implements IMainGroupDates {
    ChangeGroupDatesStatus(data: AuctDateGroups, params: params): Promise<GroupDatesResponse> {
        return ChangeGroupDatesStatus(data, params.auct_date_id);
    }
}

export default MainGroupDatesUsecases;