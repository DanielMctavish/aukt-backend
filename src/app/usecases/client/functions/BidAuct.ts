import IBid from "../../../entities/IBid";
import axios from "axios";
import { ClientResponse } from "../../IMainClient";
import PrismaBidRepositorie from "../../../repositorie/database/PrismaBidRepositorie";
import PrismaClientRepositorie from "../../../repositorie/database/PrismaClientRepositorie";
import PrismaProductRepositorie from "../../../repositorie/database/PrismaProductRepositorie";

const prismaBid = new PrismaBidRepositorie()
const prismaClient = new PrismaClientRepositorie()
const prismaProduct = new PrismaProductRepositorie()

export const bidAuct = (data: IBid): Promise<ClientResponse> => {


    return new Promise(async (resolve, reject) => {

        try {
            console.log("observando data -> ", data)
            const currentBid = await prismaBid.CreateBid(data)

            data.product_id &&
                await prismaProduct.update({
                    initial_value: currentBid.value
                }, data.product_id)

            await axios.post(`${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${data.auct_id}-bid`, {
                body: data,
            })

            resolve({ status_code: 200, body: currentBid })

        } catch (error: any) {

            reject({ status_code: 500, body: error.message })

        }

    })

}