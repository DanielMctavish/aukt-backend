import { TemplateResponse } from "../../IMainTemplate";
import PrismaTemplateRepositorie from "../../../repositorie/database/PrismaTemplateRepositorie";

const prismaTemplate = new PrismaTemplateRepositorie();

export const findSiteTemplate = (advertiserId: string): Promise<TemplateResponse> => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!advertiserId) {
                return resolve({ 
                    status_code: 400, 
                    body: "Advertiser ID is required" 
                });
            }

            const templates = await prismaTemplate.Find(advertiserId);
            
            if (!templates || templates.length === 0) {
                return resolve({ 
                    status_code: 404, 
                    body: "No templates found for this advertiser" 
                });
            }

            return resolve({ 
                status_code: 200, 
                body: templates 
            });
        } catch (error: any) {
            return reject({ 
                status_code: 500, 
                body: error.message 
            });
        }
    });
}; 