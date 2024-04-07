import { AdvertiserResponse } from "../../IMainAdvertiser";
import PrismaAdvertiserRepositorie from "../../../repositorie/database/PrismaAdvertiserRepositorie";
const prismaAdvertiser = new PrismaAdvertiserRepositorie()

export const deleteAdvertiser = (advertiser_id: string): Promise<AdvertiserResponse> => {

    return new Promise(async (resolve, reject) => {
        try {
            const currentAdvertiser = await prismaAdvertiser.delete(advertiser_id)
            return resolve({ status_code: 200, body: !currentAdvertiser ? "USER NOT FOUNDED" : currentAdvertiser })
        } catch (error: any) {
            return reject({ status_code: 500, body: error.message })
        }
    })

}