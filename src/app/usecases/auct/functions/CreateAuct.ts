import { IAuct } from "../../../entities/IAuct";
import { AuctResponse } from "../../IMainAuct";
import PrismaAuctRepositorie from "../../../repositorie/database/PrismaAuctRepositorie";
import generateNanoId from "../../../../utils/GenerateNanoId";
const prismaAuct = new PrismaAuctRepositorie()


export const createAuct = (data: IAuct): Promise<AuctResponse> => {

    return new Promise(async (resolve, reject) => {
        try {

            !data ? reject({ status_code: 404, body: 'no data sended' }) : ''

            const currentAuct = await prismaAuct.create({ ...data, nano_id: generateNanoId(7) })
            resolve({ status_code: 201, body: { currentAuct } })

        } catch (error: any) {

            reject({ status_code: 500, body: error.message })

        }
    })

}