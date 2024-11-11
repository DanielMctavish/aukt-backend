import { ISiteTemplate } from "../entities/ISiteTemplate";

interface ITemplateRepositorie {
    Create(data: ISiteTemplate): Promise<ISiteTemplate>;
    Find(advertiser_id: string): Promise<ISiteTemplate[]>;
    FindById(template_id: string): Promise<ISiteTemplate>;
    Update(data: Partial<ISiteTemplate>, template_id: string): Promise<ISiteTemplate>;
    Delete(template_id: string): Promise<ISiteTemplate>;
}

export default ITemplateRepositorie;