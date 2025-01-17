import { TemplateResponse } from "../../IMainTemplate";
import PrismaTemplateRepositorie from "../../../repositorie/database/PrismaTemplateRepositorie";
import { ISiteTemplate } from "../../../entities/ISiteTemplate";

const prismaTemplate = new PrismaTemplateRepositorie();

export const updateSiteTemplate = (data: Partial<ISiteTemplate>, template_id: string): Promise<TemplateResponse> => {

    return new Promise(async (resolve, reject) => {
        try {
            // Validação do template_id
            if (!template_id) {
                return reject({ status_code: 404, body: 'Template ID is required' });
            }

            if (!data) {
                return reject({ status_code: 404, body: 'No data sent' });
            }


            const currentTemplate = await prismaTemplate.Update(data, template_id);
            return resolve({ status_code: 200, body: currentTemplate });

        } catch (error: any) {
            return reject({
                status_code: error.status_code || 500,
                body: error.message || "Internal server error"
            });
        }
    });
}; 