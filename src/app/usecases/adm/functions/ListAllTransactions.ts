import PrismaAdvertiserRepositorie from "../../../repositorie/database/PrismaAdvertiserRepositorie"
import PrismaTransactionRepositorie from "../../../repositorie/database/PrismaTransactionRepositorie"
import { AdministratorResponse } from "../../IMainAdministrador"

const prismaAvertiser = new PrismaAdvertiserRepositorie()
const prismaTransaction = new PrismaTransactionRepositorie()

const listAllTransactions = async (advertiserId: string): Promise<AdministratorResponse> => {

    return new Promise(async (resolve, reject) => {

        try {
            const currentAdvertiser = await prismaAvertiser.find(advertiserId)

            if (!currentAdvertiser) {
                return reject({
                    status_code: 404,
                    body: "Advertiser not found"
                })
            }

            const transactions = await prismaTransaction.list(advertiserId)
            return resolve({
                status_code: 200,
                body: transactions
            })
        } catch (error: any) {
            return reject({
                status_code: 500,
                body: error.message
            })

        }

    })


}

export default listAllTransactions