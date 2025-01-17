import PrismaCartelaRepositorie from "../../../repositorie/database/PrismaCartelaRepositorie"
import { CartelaResponse } from "../../IMainCartela"

const prismaCartela = new PrismaCartelaRepositorie()

const getGeneralAmountCartelas = async (): Promise<CartelaResponse> => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalAmount = await prismaCartela.getTotalAmount();

            resolve({
                status_code: 200,
                body: { totalAmount }
            })
        } catch (error: any) {
            reject({
                status_code: 500,
                body: {
                    msg: error.message,
                }
            })
        }
    })
}

export { getGeneralAmountCartelas }
