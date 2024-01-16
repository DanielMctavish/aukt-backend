import { IAdvertiser } from "./IAdvertiser"
import { IAuct } from "./IAuct"


export interface IProduct {
    id: string,
    owner_id: string,
    Advertiser?: IAdvertiser,
    advertiser_id?: string | undefined,
    Auct?: IAuct,
    auct_id?: string | undefined,
    title: string,
    description: string,
    categorie: string,
    initial_value: number,
    final_value: number,
    reserve_value: number,
    color: string,
    width: string,
    height: string,
    weight: string,
    cover_img_url: string,
    img01_url: string,
    img02_url: string,
    img03_url: string,
    img04_url: string,
    img05_url: string,
    img06_url: string,
    highlight_product: boolean,
    created_at: Date
    updated_at: Date
}