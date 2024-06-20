import bcrypt from "bcrypt";
import { AdvertiserResponse } from "../../IMainAdvertiser";
import PrismaAdvertiserRepositorie from "../../../repositorie/database/PrismaAdvertiserRepositorie";
import { IAdvertiser } from "../../../entities/IAdvertiser";
const prismaAdvertiser = new PrismaAdvertiserRepositorie()

export const updateAdvertiser = (data: IAdvertiser, advertiser_id: string): Promise<AdvertiserResponse> => {

    return new Promise(async (resolve, reject) => {

        try {

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(data.password, salt)
            const currentAdvertiser = await prismaAdvertiser.update(advertiser_id, { ...data, password: hash })
            return resolve({ status_code: 201, body: currentAdvertiser })

        } catch (error: any) {
            return reject({ status_code: 500, body: error.message })
        }

    })

}