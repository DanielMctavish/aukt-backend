import PrismaCartelaRepositorie from "../../../repositorie/database/PrismaCartelaRepositorie"
import { ICartela } from "../../../entities/ICartela"
import { CartelaResponse } from "../../IMainCartela"

const prismaCartela = new PrismaCartelaRepositorie()

const listCartela = async (advertiser_id: string, auction_id?: string): Promise<CartelaResponse> => {

    return new Promise(async (resolve, reject) => {

        try {

            if (!advertiser_id) {
                return reject({
                    status_code: 403,
                    body: "you need to provide advertiser_id"
                })
            }

            const currentCartela = await prismaCartela.list(advertiser_id, auction_id)

            if (!currentCartela[0]) {
                return reject({
                    status_code: 404,
                    body: {
                        msg: "not founded valids cartelas",
                        advertiser_id: advertiser_id
                    }
                })
            }
            resolve({
                status_code: 201,
                body: currentCartela
            })

        } catch (error: any) {
            reject({
                status_code: 500,
                body: {
                    msg: "error at try list cartela",
                    error: error.message
                }
            })
        }

    })

}

export { listCartela }