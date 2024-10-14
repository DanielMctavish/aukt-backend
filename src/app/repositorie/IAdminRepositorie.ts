import { IAdmin } from "../entities/IAdmin"
import { IAdvertiser } from "../entities/IAdvertiser"
import { IAuct } from "../entities/IAuct"
import { PoliceStatus } from "../entities/IAdvertiser"

export interface IAdminRepositorie {
    create(data: IAdmin): Promise<IAdmin>
    find(administrador_id: string): Promise<IAdmin | null>
    list(): Promise<IAdmin[]>
    findByEmail(email: string): Promise<IAdmin | null>
    update(data: Partial<IAdmin>,admin_id: string): Promise<IAdmin>
    listAllAdvertisers(): Promise<IAdvertiser[]>
    listAllAuctions(): Promise<IAuct[]>
    updateAdvertiserPoliceStatus(advertiserId: string, status: PoliceStatus): Promise<IAdvertiser>
    getTotalCounts(): Promise<{ advertisersCount: number, clientsCount: number }>
}
