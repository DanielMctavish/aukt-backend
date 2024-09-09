import { ITransaction } from "../entities/ITransaction"

interface transactionsResponse {
    status_code: number
    body: Object
}

interface paramsTransaction {
    auct_id: string
    creator_id: string
    nano_id: string
    status: any
    cartela_id: string
    transaction_id: string
    advertiser_id: string
}

interface IMainTransactions {
    CreateTransaction(data: ITransaction): Promise<transactionsResponse>
    FindTransaction(data: any, params: paramsTransaction): Promise<transactionsResponse>
    ListTransactions(data: any, params: paramsTransaction): Promise<transactionsResponse>
    UpdateTransaction(data: ITransaction, params: paramsTransaction): Promise<transactionsResponse>
    DeleteTransaction(data: any, params: paramsTransaction): Promise<transactionsResponse>
}

export { paramsTransaction, transactionsResponse }
export default IMainTransactions