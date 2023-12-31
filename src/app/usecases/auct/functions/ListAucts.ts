import { IAuct } from "../../../entities/IAuct";
import { AuctResponse } from "../../IMainAuct";
import PrismaAuctRepositorie from "../../../repositorie/database/PrismaAuctRepositorie";
const prismaAuct = new PrismaAuctRepositorie()


export const listAuct = (auct: Partial<IAuct>): Promise<AuctResponse> => {

    return new Promise(async (resolve, reject) => {
        try {

            // !data?reject({status_code:404,body:'no data sended'}):''
            if (!auct.creator_id) return reject({ status_code: 403, body: "not creator_id sended" })
            const currentAuct = await prismaAuct.list(auct.creator_id)

            if (!currentAuct) {
                reject({ status_code: 404, body: "not auct founded" })
            } else {
                resolve({ status_code: 200, body: currentAuct })
            }

        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }
    })

}