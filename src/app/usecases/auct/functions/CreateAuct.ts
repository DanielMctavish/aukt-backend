import { IAuct } from "../../../entities/IAuct";
import { AuctResponse } from "../../IMainAuct";
import PrismaAuctRepositorie from "../../../repositorie/database/PrismaAuctRepositorie";
const prismaAuct = new PrismaAuctRepositorie()


export const createAuct = (data: IAuct): Promise<AuctResponse> => {

    return new Promise(async (resolve, reject) => {
        try {

            !data ? reject({ status_code: 404, body: 'no data sended' }) : ''

            function generateNanoId(length: number) {
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                let nanoId = '';
                for (let i = 0; i < length; i++) {
                    const randomIndex = Math.floor(Math.random() * characters.length);
                    nanoId += characters[randomIndex];
                }
                return nanoId;
            }

            const currentAuct = await prismaAuct.create({ ...data, nano_id: generateNanoId(7) })
            resolve({ status_code: 201, body: { currentAuct } })

        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }
    })

}