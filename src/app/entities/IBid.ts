import { IAuct } from "./IAuct"
import { IClient } from "./IClient"


interface IBid {
    id: string
    value: number
    Client?: IClient
    client_id?: string | undefined
    Auct?: IAuct
    auct_id?: string | undefined
    created_at: Date
    updated_at: Date
}

export default IBid