import { IAuct } from "../../../entities/IAuct";
import { AuctResponse } from "../../IMainAuct";
import PrismaAuctRepositorie from "../../../repositorie/database/PrismaAuctRepositorie";
const prismaAuct = new PrismaAuctRepositorie()

interface params {
    auct_id: string
    creator_id: string
}


export const listAuct = (creator_id: string): Promise<AuctResponse> => {

    return new Promise(async (resolve, reject) => {
        try {

            // !data?reject({status_code:404,body:'no data sended'}):''
            const currentAuct = await prismaAuct.list(creator_id)

            if (!currentAuct) {
                reject({ status_code: 404, body: "any auct founded" })
            } else {
                resolve({ status_code: 200, body: currentAuct })
            }

        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }
    })

}