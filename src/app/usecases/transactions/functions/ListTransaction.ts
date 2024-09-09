import PrismaTransactionRepositorie from "../../../repositorie/database/PrismaTransactionRepositorie"
import { CartelaResponse } from "../../IMainCartela"
import { ITransaction } from "../../../entities/ITransaction"

const prismaTransaction = new PrismaTransactionRepositorie()

const listTransaction = async (advertiser_id: string): Promise<CartelaResponse> => {

    return new Promise(async (resolve, reject) => {

        try {

            const list: ITransaction[] = await prismaTransaction.list(advertiser_id)

            resolve({
                status_code: 201,
                body: list
            })

        } catch (error: any) {
            reject({
                status_code: 500,
                body: {
                    msg: "error at try list transaction",
                }
            })
        }

    })

}

export { listTransaction }