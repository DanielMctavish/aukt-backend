import { IAuct } from "../../../entities/IAuct";
import { AuctResponse } from "../../IMainAuct";
import PrismaAuctRepositorie from "../../../repositorie/database/PrismaAuctRepositorie";
import generateNanoId from "../../../../utils/GenerateNanoId";
import PrismaAdvertiserRepositorie from "../../../repositorie/database/PrismaAdvertiserRepositorie";
const prismaAuct = new PrismaAuctRepositorie();
const prismaAdvertiser = new PrismaAdvertiserRepositorie();

export const createAuct = (data: IAuct): Promise<AuctResponse> => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.advertiser_id) {
                return reject({
                    status_code: 403,
                    body: "advertiser_id not sended"
                });
            }

            const currentAdvertiser = await prismaAdvertiser.find(data.advertiser_id);
            if (!currentAdvertiser) {
                return reject({
                    status_code: 404,
                    body: "Advertiser not founded"
                });
            }

            if (!data) {
                return reject({ status_code: 404, body: 'no data sended' });
            }


            const currentAuct = await prismaAuct.create({ ...data, nano_id: generateNanoId(7) });
            if (!currentAuct) {
                return reject({
                    status_code: 500,
                    body: "Failed to create auction"
                });
            }

            resolve({ status_code: 201, body: { ...currentAuct } });

        } catch (error: any) {
            reject({ status_code: 500, body: error.message });
        }
    });
};