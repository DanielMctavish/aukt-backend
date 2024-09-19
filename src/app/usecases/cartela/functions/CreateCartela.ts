import PrismaCartelaRepositorie from "../../../repositorie/database/PrismaCartelaRepositorie"
import { ICartela } from "../../../entities/ICartela"
import { CartelaResponse } from "../../IMainCartela"
import { createTransaction } from "../../transactions/functions/CreateTransaction";

const prismaCartela = new PrismaCartelaRepositorie()

const createCartela = async (data: ICartela): Promise<CartelaResponse> => {

    return new Promise(async (resolve, reject) => {

        try {

            if (!data.advertiser_id || !data.client_id || !data.auction_id) {
                return reject({
                    status_code: 403,
                    body: "you need to provide advertiser_id, client_id, and auction_id"
                })
            }

            const newCartela = await prismaCartela.create(data)

            
            await createTransaction({
                advertiser_id: data.advertiser_id,
                amount: data.amount,
                cartela_id: newCartela.id,
                payment_method:"Pix"
            })

            resolve({
                status_code: 201,
                body: newCartela
            })

        } catch (error: any) {

            console.log(error)
            reject({
                status_code: 500,
                body: {
                    msg: error.message,
                }
            })
        }

    })

}

export { createCartela }