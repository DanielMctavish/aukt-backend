import { AdvertiserResponse } from "../../IMainAdvertiser";
import PrismaAdvertiserRepositorie from "../../../repositorie/database/PrismaAdvertiserRepositorie";
import { IAdvertiser } from "../../../entities/IAdvertiser";
const prismaAdvertiser = new PrismaAdvertiserRepositorie()

export const createAdvertiser = (data: IAdvertiser): Promise<AdvertiserResponse> => {

    return new Promise(async (resolve, reject) => {

        try {

            const currentAdvertiser = await prismaAdvertiser.create(data)
            return resolve({ status_code: 201, body: currentAdvertiser })

        } catch (error: any) {
            return reject({ status_code: 500, body: error.message })
        }

    })

}