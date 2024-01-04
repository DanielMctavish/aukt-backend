import { IAuct } from "../../../entities/IAuct";
import { AuctResponse } from "../../IMainAuct";
import PrismaAuctRepositorie from "../../../repositorie/database/PrismaAuctRepositorie";
const prismaAuct = new PrismaAuctRepositorie()


export const findAuct = (id:string): Promise<AuctResponse> => {

    return new Promise(async (resolve, reject) => {
        try {

            // !data?reject({status_code:404,body:'no data sended'}):''
            if (!id) return reject({ status_code: 403, body: "not auct_id sended" })
            const currentAuct = await prismaAuct.find(id)

            if (!currentAuct) {
                reject({ status_code: 404, body: "not auct founded" })
            } else {
                resolve({ status_code: 201, body: currentAuct })
            }

        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }
    })

}