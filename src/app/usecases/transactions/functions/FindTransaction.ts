import PrismaTransactionRepositorie from "../../../repositorie/database/PrismaTransactionRepositorie"
import { CartelaResponse } from "../../IMainCartela"
import { ITransaction } from "../../../entities/ITransaction"

const prismaTransaction = new PrismaTransactionRepositorie()

const findTransaction = async (transaction_id: string): Promise<CartelaResponse> => {

    return new Promise(async (resolve, reject) => {

        try {

            const currentTransaction = await prismaTransaction.find(transaction_id)
            if(!currentTransaction){
                return reject({
                    status_code:404,
                    body:{
                        msg:"not transaction founded"
                    }
                })
            }
            
            resolve({
                status_code: 201,
                body: currentTransaction
            })

        } catch (error: any) {
            reject({
                status_code: 500,
                body: {
                    msg: "error at try find transaction",
                    error: error.message
                }
            })
        }

    })

}

export { findTransaction }