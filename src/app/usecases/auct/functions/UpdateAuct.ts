import { IAuct } from "../../../entities/IAuct";
import { AuctResponse } from "../../IMainAuct";
import PrismaAuctRepositorie from "../../../repositorie/database/PrismaAuctRepositorie";
const prismaAuct = new PrismaAuctRepositorie()


export const updateAuct = (data: IAuct, auct_id: string): Promise<AuctResponse> => {

    return new Promise(async (resolve, reject) => {
        try {

            !data ? reject({ status_code: 404, body: 'no data sended' }) : ''
            if (!auct_id || typeof auct_id !== 'string') {
                return reject({ status_code: 404, body: 'not auct_id passed' })
            } else {
                const currentAuct = await prismaAuct.update(data, auct_id)
                resolve({ status_code: 201, body: !currentAuct ? '' : currentAuct })
            }


        } catch (error: any) {
            reject({ status_code: 500, body: error })
        }
    })

}