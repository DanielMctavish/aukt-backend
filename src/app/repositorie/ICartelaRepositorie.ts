import { ICartela } from "../entities/ICartela"


export interface ICartelaRepositorie {
    create(data: ICartela): Promise<ICartela>
    find(cartela_id: string): Promise<ICartela | null>
    list( auction_id: string): Promise<ICartela[]> 
    listByClient(client_id:string): Promise<ICartela[]>
    update(data: Partial<ICartela>, cartela_id: string): Promise<ICartela>
    delete(cartela_id: string): Promise<ICartela | null>
    getTotalAmount(): Promise<number>
}
