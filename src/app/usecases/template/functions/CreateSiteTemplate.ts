import { TemplateResponse } from "../../IMainTemplate";
import PrismaTemplateRepositorie from "../../../repositorie/database/PrismaTemplateRepositorie";
import { ISiteTemplate } from "../../../entities/ISiteTemplate";

const prismaTemplate = new PrismaTemplateRepositorie();

export const createSiteTemplate = (data: ISiteTemplate): Promise<TemplateResponse> => {

    // console.log("observando o data -> ", data.sections)

    return new Promise(async (resolve, reject) => {
        try {
            const currentTemplate = await prismaTemplate.Create(data);
            return resolve({ status_code: 201, body: currentTemplate });
        } catch (error: any) {
            return reject({ status_code: 500, body: error.message });
        }
    });

}; 