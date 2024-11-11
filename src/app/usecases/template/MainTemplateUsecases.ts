import { ISiteTemplate } from "../../entities/ISiteTemplate";
import IMainTemplate, { TemplateResponse } from "../IMainTemplate";
import { createSiteTemplate } from "./functions/CreateSiteTemplate";
import { deleteSiteTemplate } from "./functions/DeleteSiteTemplate";
import { findSiteTemplate } from "./functions/FindSiteTemplate";
import { findTemplateById } from "./functions/FindTemplateById";
import { updateSiteTemplate } from "./functions/UpdateSiteTemplate";

interface params {
    template_id?: string;
    advertiserId?: string;
}

class MainTemplateUsecases implements IMainTemplate {
    CreateSiteTemplate(data: ISiteTemplate): Promise<TemplateResponse> {
        return createSiteTemplate(data);
    }

    FindSiteTemplate(data: any, params: params): Promise<TemplateResponse> {
        if (!params.advertiserId) {
            throw new Error("Advertiser ID is required");
        }
        return findSiteTemplate(params.advertiserId);
    }

    FindTemplateById(data: any, params: params): Promise<TemplateResponse> {
        if (!params.template_id) {
            throw new Error("Template ID is required");
        }
        return findTemplateById(params.template_id);
    }

    UpdateSiteTemplate(data: Partial<ISiteTemplate>, params: params): Promise<TemplateResponse> {
        if (!params.template_id) {
            throw new Error("Template ID is required");
        }
        return updateSiteTemplate(data, params.template_id);
    }

    DeleteSiteTemplate(data: any, params: params): Promise<TemplateResponse> {
        if (!params.template_id) {
            throw new Error("Template ID is required");
        }
        return deleteSiteTemplate(params.template_id);
    }
}

export default MainTemplateUsecases; 