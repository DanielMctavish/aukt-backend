import { AdvertiserResponse } from "../../IMainAdvertiser";
import PrismaAdvertiserRepositorie from "../../../repositorie/database/PrismaAdvertiserRepositorie";
const prismaAdvertiser = new PrismaAdvertiserRepositorie()

export const findAdvertiser = (advertiserId: string): Promise<AdvertiserResponse> => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!advertiserId) {
                return resolve({ 
                    status_code: 400, 
                    body: "Advertiser ID is required" 
                });
            }

            const currentAdvertiser = await prismaAdvertiser.find(advertiserId);
            
            if (!currentAdvertiser) {
                return resolve({ 
                    status_code: 404, 
                    body: "Advertiser not found" 
                });
            }

            return resolve({ 
                status_code: 200, 
                body: currentAdvertiser 
            });
        } catch (error: any) {
            return reject({ 
                status_code: 500, 
                body: error.message 
            });
        }
    });
}