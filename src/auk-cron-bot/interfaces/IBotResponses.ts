import { AuctDateGroups, IAuct } from "../../app/entities/IAuct";

export interface IBotResponses {
    status: number,
    message: string,
    slots: JSON | string
}

export interface IFloorAuction {
    auct_id: string;
    auct_title: string;
    current_group?: string;
    current_product: string;
    current_product_id: string;
    timer_freezed: number;
}

export interface IArgumentsResume {
    currentAuction: IAuct
    currentAuctionDate: AuctDateGroups
    timer_freezed: number
    current_product_id: string
}