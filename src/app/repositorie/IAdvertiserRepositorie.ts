import { IAdvertiser } from "../entities/IAdvertiser"


export interface IAdvertiserRepositorie {
    create(data: IAdvertiser): Promise<IAdvertiser>
    find(advertiser_id: string): Promise<IAdvertiser | null>
    findByEmail(email: string): Promise<IAdvertiser | null>
    update(advertiser_id: string, data: Partial<IAdvertiser>): Promise<IAdvertiser>
    delete(advertiser_id: string): Promise<IAdvertiser | null>
}