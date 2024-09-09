import { ITransaction } from "../../entities/ITransaction";
import IMainTransactions, { paramsTransaction, transactionsResponse } from "../IMainTransactions";
import { createTransaction } from "./functions/CreateTransaction";
import { deleteTransaction } from "./functions/DeleteTransaction";
import { findTransaction } from "./functions/FindTransaction";
import { listTransaction } from "./functions/ListTransaction";
import { updateTransaction } from "./functions/UpdateTransaction";


class MainTransactionsUsecases implements IMainTransactions {

    async CreateTransaction(data: ITransaction): Promise<transactionsResponse> {
        return createTransaction(data)
    }

    async FindTransaction(data: any, params: paramsTransaction): Promise<transactionsResponse> {
        return findTransaction(params.transaction_id)
    }

    async ListTransactions(data: any, params: paramsTransaction): Promise<transactionsResponse> {
        return listTransaction(params.advertiser_id)
    }

    async UpdateTransaction(data: ITransaction, params: paramsTransaction): Promise<transactionsResponse> {
        return updateTransaction(data, params.transaction_id)
    }

    async DeleteTransaction(data: any, params: paramsTransaction): Promise<transactionsResponse> {
        return deleteTransaction(params.transaction_id)
    }

}


export default MainTransactionsUsecases