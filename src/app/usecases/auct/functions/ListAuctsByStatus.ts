import { IAuct } from "../../../entities/IAuct";
import { AuctResponse } from "../../IMainAuct";
import PrismaAuctRepositorie from "../../../repositorie/database/PrismaAuctRepositorie";
const prismaAuct = new PrismaAuctRepositorie()


export const listAuctByStatus = (status: any): Promise<AuctResponse> => {

    return new Promise(async (resolve, reject) => {
        try {

            // !data?reject({status_code:404,body:'no data sended'}):''
            const Auctions: IAuct[] = await prismaAuct.listByStatus(status)

            if (!Auctions) {
                reject({ status_code: 404, body: "any auct founded" })
            } else {
                resolve({ status_code: 200, body: Auctions })
            }

        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }
    })

}