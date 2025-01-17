import { ICartela } from "../../../entities/ICartela"
import PrismaCartelaRepositorie from "../../../repositorie/database/PrismaCartelaRepositorie"
import { CartelaResponse } from "../../IMainCartela"

const prismaCartela = new PrismaCartelaRepositorie()

const updateCartela = async (data: ICartela, cartela_id: string): Promise<CartelaResponse> => {

    return new Promise(async (resolve, reject) => {

        try {

            const cartelaUpdated = await prismaCartela.update(data, cartela_id)

            resolve({
                status_code: 201,
                body: cartelaUpdated
            })

        } catch (error: any) {
            reject({
                status_code: 500,
                body: {
                    msg: "error at try update cartela",
                    cartela: data
                }
            })
        }

    })

}

export { updateCartela }