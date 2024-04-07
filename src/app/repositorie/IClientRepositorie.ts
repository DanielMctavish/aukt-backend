import { IClient } from "../entities/IClient"


export interface IClientRepositorie {
    create(data: IClient): Promise<IClient>
    find(client_id: string): Promise<IClient | null>
    findByEmail(email: string): Promise<IClient | null>
    list(): Promise<IClient[]>
    update(data: Partial<IClient>, client_id: string): Promise<IClient>
    delete(client_id: string): Promise<IClient | null>
}