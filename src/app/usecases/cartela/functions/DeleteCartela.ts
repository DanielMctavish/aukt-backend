import PrismaCartelaRepositorie from "../../../repositorie/database/PrismaCartelaRepositorie"
import { ICartela } from "../../../entities/ICartela"
import { CartelaResponse } from "../../IMainCartela"

const prismaCartela = new PrismaCartelaRepositorie()

const deleteCartela = async (cartela_id: string): Promise<CartelaResponse> => {

    return new Promise(async (resolve, reject) => {

        try {

            if (!cartela_id) {
                return reject({
                    status_code: 403,
                    body: "you need to provide cartela_id"
                })
            }

            const currentCartela = await prismaCartela.delete(cartela_id)

            if (!currentCartela) {
                return reject({
                    status_code: 404,
                    body: {
                        msg: "not founded valid cartela",
                        cartela_id: cartela_id
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
                    msg: "error at try delete cartela",
                    cartela_id: cartela_id
                }
            })
        }

    })

}

export { deleteCartela }