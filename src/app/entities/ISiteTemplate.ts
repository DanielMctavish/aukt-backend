import { ColorPalette, LayoutType, AlignmentType, DestinationType, SectionType, SizeType, HeaderModel } from "./EnumsTemplate";
import { IAdvertiser } from "./IAdvertiser";



interface ISiteTemplate {
    id: string;
    Advertiser?: IAdvertiser;
    advertiserId: string;
    colorPalette: ColorPalette;
    fontStyle: string;
    header?: ITemplateHeader;
    headerId?: string;
    sections: ITemplateSections[];
    footer?: ITemplateFooter;
    footerId?: string;
    created_at: Date;
    updated_at: Date;
}

interface IConfigSection {
    selectedAuctId?: string | null;
    layout?: LayoutType;
    itemsPerRow?: number;
    showPrice?: boolean;
    showTitle?: boolean;
    autoplay?: boolean;
    speed?: number;
    content?: string;
    alignment?: AlignmentType;
    fontSize?: string;
    textColor?: string;
    preserveLineBreaks?: boolean;
    destination?: DestinationType;
    whatsappNumber?: string;
    email?: string;
    fields?: Array<{
        type: string;
        label: string;
        required: boolean;
    }>;
    buttonText?: string;
    successMessage?: string;
}

interface ITemplateSections {
    type: SectionType;
    config: IConfigSection;
    color: string;
    sizeType: SizeType;
}

interface IHeaderText {
    title: string;
    content: string;
    positionTop: string;
    positionLeft: string;
    positionWidth: string;
    titleBackground: string;
    titleColor: string;
    contentColor: string;
    titleSize: string;
    titleBorderRadius: string;
    visible: boolean;
}

interface IHeaderCarousel {
    enabled: boolean;
    title: string;
    selectedAuctId?: string | null;
    sizeWidth: string;
    sizeHeight: string;
    itemsToShow: number;
    speed: number;
    positionTop: string;
    positionLeft: string;
    showTitle: boolean;
    showPrice: boolean;
    showCarouselTitle: boolean;
    showNavigation: boolean;
}

interface ITemplateHeader {
    color: string;
    sizeType: SizeType;
    model: HeaderModel;
    backgroundImage: string | null;
    backgroundImageOpacity: number;
    backgroundImageBlur: number;
    backgroundImageBrightness: number;
    elementsOpacity: number;
    texts: IHeaderText[];
    carousel?: IHeaderCarousel;
}

interface IFooterSection {
    title: string;
    links: Array<{
        name: string;  // Mudando de label para name
        url: string;
    }>;
}

interface ISocialMedia {
    type: string;     // tipo da rede social (facebook, instagram, etc)
    url: string;      // URL do perfil
}

interface ITemplateFooter {
    color: string;
    sizeType: SizeType;
    companyName: string;
    showSocialLinks: boolean;
    textColor: string;
    borderColor: string;
    elementsOpacity: number;
    sections: IFooterSection[];  // Mudando para array ao invés de Record
    socialMedia: ISocialMedia[]; // Adicionando array de redes sociais
}

export {
    ISiteTemplate,
    ITemplateSections,
    ITemplateHeader,
    ITemplateFooter,
    IHeaderText,
    IHeaderCarousel,
    IFooterSection
};