import PrismaCartelaRepositorie from "../../../repositorie/database/PrismaCartelaRepositorie"
import { ICartela } from "../../../entities/ICartela"
import { CartelaResponse } from "../../IMainCartela"

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

            resolve({
                status_code: 201,
                body: newCartela
            })

        } catch (error: any) {
            reject({
                status_code: 500,
                body: {
                    msg: "error at try create cartela",
                    error: error.message
                }
            })
        }

    })

}

export { createCartela }