import { ICartela } from "../entities/ICartela"


export interface ICartelaRepositorie {
    create(data: ICartela): Promise<ICartela>
    find(cartela_id: string): Promise<ICartela | null>
    list(advertiser_id: string, auction_id?: string): Promise<ICartela[]> // Add auction_id as optional parameter
    update(data: Partial<ICartela>, cartela_id: string): Promise<ICartela>
    delete(cartela_id: string): Promise<ICartela | null>
}