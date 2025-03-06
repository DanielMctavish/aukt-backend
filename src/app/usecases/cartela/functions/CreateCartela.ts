import PrismaCartelaRepositorie from "../../../repositorie/database/PrismaCartelaRepositorie"
import PrismaAdminRepositorie from "../../../repositorie/database/PrismaAdminRepositorie"
import { ICartela } from "../../../entities/ICartela"
import { CartelaResponse } from "../../IMainCartela"
import { createTransaction } from "../../transactions/functions/CreateTransaction"
import MainMessenger from "../../messenger/MainMessenger"
import PrismaClientRepositorie from "../../../repositorie/database/PrismaClientRepositorie"

const prismaCartela = new PrismaCartelaRepositorie()
const prismaAdmin = new PrismaAdminRepositorie()


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
            const amount = data.amount;
            const commission = amount * 0.06;

            await createTransaction({
                advertiser_id: data.advertiser_id,
                amount: amount - commission,
                cartela_id: newCartela.id,
                payment_method: "Pix"
            })

            //TODO: lembrar de subtrair o valor da comissão do saldo do advertiser

            const currentAdmin = await prismaAdmin.find("cm5l2af0e0000unb30anlp8xm")
            currentAdmin && await prismaAdmin.update({
                balance: (currentAdmin.balance ? currentAdmin.balance : 0) + commission
            }, currentAdmin?.id);

            // Envio de email simplificado
            const mainMessenger = new MainMessenger()
            try {
                await mainMessenger.SendEmail(newCartela, data.Client.email);
            } catch (emailError: any) {
                console.log('Erro ao enviar email de confirmação:', emailError.body);
            }

            resolve({
                status_code: 201,
                body: newCartela
            })

        } catch (error: any) {
            // console.log("observando cartela do cliente -> ", data.client_id)
            console.log("erro ao tentar criar cartela", error)
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