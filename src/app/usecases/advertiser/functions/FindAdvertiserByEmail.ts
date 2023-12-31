import { AdvertiserResponse } from "../../IMainAdvertiser";
import PrismaAdvertiserRepositorie from "../../../repositorie/database/PrismaAdvertiserRepositorie";
const prismaAdvertiser = new PrismaAdvertiserRepositorie()

export const findAdvertiserByEmail = (email: string): Promise<AdvertiserResponse> => {

    return new Promise(async (resolve, reject) => {

        try {
            const currentAdvertiser = await prismaAdvertiser.findByEmail(email)
            return resolve({ status_code: 201, body: !currentAdvertiser?"USER NOT FOUNDED": currentAdvertiser })
        } catch (error: any) {
            return reject({ status_code: 500, body: error.message })
        }

    })

}