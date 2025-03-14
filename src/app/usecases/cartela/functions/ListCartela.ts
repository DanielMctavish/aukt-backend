import PrismaCartelaRepositorie from "../../../repositorie/database/PrismaCartelaRepositorie"
import { ICartela } from "../../../entities/ICartela"
import { CartelaResponse } from "../../IMainCartela"

const prismaCartela = new PrismaCartelaRepositorie()

const listCartela = async (auction_id: string): Promise<CartelaResponse> => {

    return new Promise(async (resolve, reject) => {

        try {

            const currentCartelas = await prismaCartela.list(auction_id)

            if (!currentCartelas[0]) {
                return reject({
                    status_code: 404,
                    body: {
                        msg: "not founded valids cartelas"
                    }
                })
            }
            resolve({
                status_code: 201,
                body: currentCartelas
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