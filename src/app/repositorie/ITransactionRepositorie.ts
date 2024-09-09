import { ITransaction } from "../entities/ITransaction"

export interface ITransactionRepositorie {
    create(data: Partial<ITransaction>): Promise<ITransaction>
    find(transaction_id: string): Promise<ITransaction | null>
    list(advertiser_id: string): Promise<ITransaction[]>
    update(data: Partial<ITransaction>, transaction_id: string): Promise<ITransaction>
    delete(transaction_id: string): Promise<ITransaction | null>
}
