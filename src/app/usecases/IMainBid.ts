
interface IBidResponse {
    status_code: number
    body: Object
}

interface IMainBid {
    ListBid(product_id: string): Promise<IBidResponse>
}