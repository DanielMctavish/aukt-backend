import { IAuct } from "./IAuct"
import { IClient } from "./IClient"
import { IProduct } from "./IProduct"


interface IBid {
    id: string
    value: number
    Client?: IClient
    client_id?: string | any
    Auct?: IAuct
    auct_id?: string | any
    product_id?: string | any
    Product?: IProduct[] | any
    cover_auto?: boolean
    cover_auto_limit?: number
    created_at: Date
    updated_at: Date
}

export default IBid