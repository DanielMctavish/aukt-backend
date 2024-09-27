import { AuctDateGroups } from "@prisma/client";

export interface GroupDatesResponse {
    status_code: number;
    body: Object;
}

interface params {
    auct_date_id: string
}

interface IMainGroupDates {
    ChangeGroupDatesStatus(data: AuctDateGroups, params: params): Promise<GroupDatesResponse>;
}

export default IMainGroupDates;