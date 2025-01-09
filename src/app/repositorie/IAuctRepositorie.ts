import { IAuct } from "../entities/IAuct"

interface params {
    auct_id: string
    creator_id: string
    client_id:string
    url: string
    nano_id: string
    status: any
}
export interface IAuctRepositorie {
    create(data: IAuct): Promise<IAuct | null>
    find(id: string): Promise<IAuct | null>
    findByNanoId(nano_id: string): Promise<IAuct | null>
    list(params: params): Promise<IAuct[]>
    listByStatus(status: string): Promise<IAuct[]>
    update(data: Partial<IAuct>, id: string): Promise<IAuct | null>
    delete(id: string): Promise<IAuct | null>

    //counts.................................................................
    countAll(): Promise<number>
    countLive(): Promise<number>
    countCataloged(): Promise<number>
    countFinished(): Promise<number>
}