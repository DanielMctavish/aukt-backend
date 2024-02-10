import { IAdvertiser } from "./IAdvertiser"
import { IAuct } from "./IAuct"


export interface IProduct {
    id: string,
    auct_nanoid?:string,
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
    width: number,
    height: number,
    weight: number,
    cover_img_url: string,
    group_imgs_url: Array<string>,
    highlight_product: boolean,
    created_at: Date
    updated_at: Date
}