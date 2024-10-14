import { ICartela } from "../entities/ICartela"


interface CartelaResponse {
    status_code: number
    body: Object
}

interface paramsCartela {
    auction_id: string
    client_id: string
    creator_id: string
    nano_id: string
    status: any
    cartela_id: string
    advertiser_id:string
}

interface IMainCartela {
    CreateCartela(data: ICartela): Promise<CartelaResponse>
    FindCartela(data: any, params: paramsCartela): Promise<CartelaResponse>
    ListCartela(data: any, params: paramsCartela): Promise<CartelaResponse>
    UpdateCartela(data: ICartela, params: paramsCartela): Promise<CartelaResponse>
    DeleteCartela(data: any, params: paramsCartela): Promise<CartelaResponse>
    GetGeneralAmountCartelas(): Promise<CartelaResponse>
}

export { paramsCartela, CartelaResponse }
export default IMainCartela
