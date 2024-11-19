import { TemplateResponse } from "../../IMainTemplate";
import PrismaTemplateRepositorie from "../../../repositorie/database/PrismaTemplateRepositorie";
import { ISiteTemplate } from "../../../entities/ISiteTemplate";

const prismaTemplate = new PrismaTemplateRepositorie();

export const updateSiteTemplate = (data: Partial<ISiteTemplate>, template_id: string): Promise<TemplateResponse> => {
    console.log("Update template data:", JSON.stringify(data, null, 2));
    
    if (data.header) {
        console.log("Header model being sent:", data.header.model);
    }

    return new Promise(async (resolve, reject) => {
        try {
            const currentTemplate = await prismaTemplate.Update(data, template_id);
            return resolve({ status_code: 200, body: currentTemplate });
        } catch (error: any) {
            return reject({ status_code: 500, body: error.message });
        }
    });
}; 