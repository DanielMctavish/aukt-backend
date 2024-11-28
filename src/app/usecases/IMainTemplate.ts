import { ISiteTemplate } from "../entities/ISiteTemplate";

export interface TemplateResponse {
    status_code: number;
    body: any;
}

interface IMainTemplate {
    CreateSiteTemplate(data: ISiteTemplate): Promise<TemplateResponse>;
    FindSiteTemplate(data: any, params: { advertiserId: string }): Promise<TemplateResponse>;
    FindTemplateById(data: any, params: { templateId: string }): Promise<TemplateResponse>;
    UpdateSiteTemplate(data: Partial<ISiteTemplate>, params: { templateId: string }): Promise<TemplateResponse>;
    DeleteSiteTemplate(data: any, params: { templateId: string }): Promise<TemplateResponse>;
}

export default IMainTemplate; 