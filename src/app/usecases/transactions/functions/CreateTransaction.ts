import PrismaTransactionRepositorie from "../../../repositorie/database/PrismaTransactionRepositorie"
import { CartelaResponse } from "../../IMainCartela"
import { ITransaction } from "../../../entities/ITransaction"

const prismaTransaction = new PrismaTransactionRepositorie()

const createTransaction = async (data: Partial<ITransaction>): Promise<CartelaResponse> => {

    return new Promise(async (resolve, reject) => {

        try {

            const currentTransaction = await prismaTransaction.create(data)

            resolve({
                status_code: 201,
                body: currentTransaction
            })

        } catch (error: any) {
            reject({
                status_code: 500,
                body: {
                    msg: "error at try create transaction",
                    transaction: data
                }
            })
        }

    })

}

export { createTransaction }