import { IAuct } from "./IAuct"
import { IClient } from "./IClient"
import { IProduct } from "./IProduct"


interface IBid {
    id: string
    value: number
    Client?: IClient
    client_id?: string | undefined
    Auct?: IAuct
    auct_id?: string | undefined
    product_id?: string | undefined
    Product?: IProduct
    created_at: Date
    updated_at: Date
}

export default IBid