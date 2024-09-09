import PrismaTransactionRepositorie from "../../../repositorie/database/PrismaTransactionRepositorie"
import { CartelaResponse } from "../../IMainCartela"
import { ITransaction } from "../../../entities/ITransaction"

const prismaTransaction = new PrismaTransactionRepositorie()

const updateTransaction = async (data: ITransaction, transaction_id: string): Promise<CartelaResponse> => {

    return new Promise(async (resolve, reject) => {

        try {

            const currentTransaction = await prismaTransaction.update(data, transaction_id)

            resolve({
                status_code: 201,
                body: currentTransaction
            })

        } catch (error: any) {
            reject({
                status_code: 500,
                body: {
                    msg: "error at try update transaction",
                    transaction: data
                }
            })
        }

    })

}

export { updateTransaction }