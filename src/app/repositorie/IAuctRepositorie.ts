import { IAuct } from "../entities/IAuct"

export interface IAuctRepositorie {
    create(data: IAuct): Promise<IAuct>
    find(id: string): Promise<IAuct | null>
    findByNanoId(nano_id: string): Promise<IAuct | null>
    list(creator_id: string): Promise<IAuct[]>
    update(data: Partial<IAuct>, id: string): Promise<IAuct | null>
    delete(id: string): Promise<IAuct | null>
}