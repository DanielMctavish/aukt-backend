import { AdvertiserResponse } from "../../IMainAdvertiser";
import PrismaAdvertiserRepositorie from "../../../repositorie/database/PrismaAdvertiserRepositorie";
const prismaAdvertiser = new PrismaAdvertiserRepositorie()

export const findAdvertiser = (adv_id: string): Promise<AdvertiserResponse> => {

    return new Promise(async (resolve, reject) => {

        try {
            const currentAdvertiser = await prismaAdvertiser.find(adv_id)
            return resolve({ status_code: !currentAdvertiser ? 404 : 200, body: !currentAdvertiser ? "USER NOT FOUNDED" : currentAdvertiser })
        } catch (error: any) {
            return reject({ status_code: 500, body: error.message })
        }

    })

}