import { IAdvertiser } from "../entities/IAdvertiser"

export interface IAdvertiserRepositorie {
    create(data: IAdvertiser): Promise<IAdvertiser>
    find(advertiserId: string): Promise<IAdvertiser | null>
    findByEmail(email: string): Promise<IAdvertiser | null>
    update(advertiserId: string, data: Partial<IAdvertiser>): Promise<IAdvertiser>
    delete(advertiserId: string): Promise<IAdvertiser | null>
}