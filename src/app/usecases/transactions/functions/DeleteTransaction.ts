import PrismaTransactionRepositorie from "../../../repositorie/database/PrismaTransactionRepositorie"
import { CartelaResponse } from "../../IMainCartela"
import { ITransaction } from "../../../entities/ITransaction"

const prismaTransaction = new PrismaTransactionRepositorie()

const deleteTransaction = async (transaction_id: string): Promise<CartelaResponse> => {

    return new Promise(async (resolve, reject) => {

        try {

            const currentTransaction = await prismaTransaction.delete(transaction_id)

            if (currentTransaction)
                resolve({
                    status_code: 201,
                    body: currentTransaction
                })

        } catch (error: any) {

            reject({
                status_code: 500,
                body: {
                    msg: "error at try create transaction",
                    error: error.message
                }
            })
            
        }

    })

}

export { deleteTransaction }