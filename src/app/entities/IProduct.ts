import { IAdvertiser } from "./IAdvertiser"
import { IAuct } from "./IAuct"
import IBid from "./IBid"
import { ICartela } from "./ICartela"
import { IClient } from "./IClient"


export interface IProduct {
    id: string
    lote: number
    auct_nanoid?: string
    Advertiser?: IAdvertiser
    advertiser_id?: string | undefined
    owner_id?: string
    Winner?: IClient | any
    winner_id?: string | undefined
    group?: string
    Auct?: IAuct
    auct_id?: string | undefined
    title: string
    description: string
    categorie: string
    initial_value: number
    reserve_value: number
    width: number
    height: number
    weight: number
    cover_img_url: string
    group_imgs_url: Array<string>
    highlight_product: boolean
    Cartela?: ICartela
    cartela_id?: string
    Bid: IBid[] | any
    created_at: Date
    updated_at: Date
}
