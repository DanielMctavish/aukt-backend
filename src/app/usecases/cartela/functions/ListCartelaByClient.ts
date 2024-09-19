import PrismaCartelaRepositorie from "../../../repositorie/database/PrismaCartelaRepositorie"
import { CartelaResponse } from "../../IMainCartela"

const prismaCartela = new PrismaCartelaRepositorie()

const listCartelaByClient = async (client_id: string): Promise<CartelaResponse> => {

    return new Promise(async (resolve, reject) => {

        try {

            const currentCartelas = await prismaCartela.listByClient(client_id)

            if (!currentCartelas[0]) {
                return reject({
                    status_code: 404,
                    body: {
                        msg: "not founded valid client"
                    }
                })
            }
            resolve({
                status_code: 200,
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

export { listCartelaByClient }