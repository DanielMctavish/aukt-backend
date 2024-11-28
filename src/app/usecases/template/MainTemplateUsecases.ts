import { ISiteTemplate } from "../../entities/ISiteTemplate";
import IMainTemplate, { TemplateResponse } from "../IMainTemplate";
import { createSiteTemplate } from "./functions/CreateSiteTemplate";
import { deleteSiteTemplate } from "./functions/DeleteSiteTemplate";
import { findSiteTemplate } from "./functions/FindSiteTemplate";
import { findTemplateById } from "./functions/FindTemplateById";
import { updateSiteTemplate } from "./functions/UpdateSiteTemplate";

interface params {
    templateId: string;
    advertiserId: string;
}

class MainTemplateUsecases implements IMainTemplate {
    CreateSiteTemplate(data: ISiteTemplate): Promise<TemplateResponse> {
        return createSiteTemplate(data);
    }

    FindSiteTemplate(data: any, params: params): Promise<TemplateResponse> {
        return findSiteTemplate(params.advertiserId);
    }

    FindTemplateById(data: any, params: params): Promise<TemplateResponse> {
        if (!params.templateId) {
            throw new Error("Template ID is required");
        }
        return findTemplateById(params.templateId);
    }

    UpdateSiteTemplate(data: Partial<ISiteTemplate>, params: params): Promise<TemplateResponse> {
        return updateSiteTemplate(data, params.templateId);
    }

    DeleteSiteTemplate(data: any, params: params): Promise<TemplateResponse> {
        if (!params.templateId) {
            throw new Error("Template ID is required");
        }
        return deleteSiteTemplate(params.templateId);
    }
}

export default MainTemplateUsecases; 