import PrismaTransactionRepositorie from "../../../repositorie/database/PrismaTransactionRepositorie"
import { CartelaResponse } from "../../IMainCartela"
import { ITransaction } from "../../../entities/ITransaction"
import PrismaAdvertiserRepositorie from "../../../repositorie/database/PrismaAdvertiserRepositorie";


const prismaTransaction = new PrismaTransactionRepositorie()
const prismaAdvertiser = new PrismaAdvertiserRepositorie()

const createTransaction = async (data: Partial<ITransaction>): Promise<CartelaResponse> => {

    return new Promise(async (resolve, reject) => {

        try {
            if (!data.advertiser_id) {
                return reject({
                    status_code: 403,
                    body: "advertiser_id is required"
                })
            }
            const currentAdvertiser = await prismaAdvertiser.find(data.advertiser_id)
            if (!currentAdvertiser) {
                return reject({
                    status_code: 404,
                    body: "advertiser not found"
                })
            }
            const currentTransaction = await prismaTransaction.create(data)
            await prismaAdvertiser.update(data.advertiser_id, {
                amount: currentAdvertiser.amount + (data.amount ? data.amount : 0)
            })

            resolve({
                status_code: 201,
                body: currentTransaction
            })

        } catch (error: any) {
            reject({
                status_code: 500,
                body: {
                    msg: "error at try create transaction",
                    transaction: error.message
                }
            })
        }

    })

}

export { createTransaction }