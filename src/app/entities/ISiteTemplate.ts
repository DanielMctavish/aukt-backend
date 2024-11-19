// Primeiro definimos os objetos de enum
export const HeaderModel = {
    MODEL_1: 'MODEL_1',
    MODEL_2: 'MODEL_2',
    MODEL_3: 'MODEL_3',
    MODEL_4: 'MODEL_4',
    MODEL_5: 'MODEL_5',
    MODEL_6: 'MODEL_6',
    MODEL_7: 'MODEL_7',
    MODEL_8: 'MODEL_8'
} as const;

export const SectionType = {
    GALLERY: 'GALLERY',
    TEXT: 'TEXT',
    FORM: 'FORM',
    AUCT_LIST: 'AUCT_LIST'
} as const;

export const SizeType = {
    SMALL: 'SMALL',
    MEDIUM: 'MEDIUM',
    FULL: 'FULL'
} as const;

export const ColorPalette = {
    CLEAN: 'CLEAN',
    CANDY: 'CANDY',
    DARK: 'DARK',
    MONOCHROMATIC: 'MONOCHROMATIC'
} as const;

export const LayoutType = {
    GRID: 'GRID',
    CAROUSEL: 'CAROUSEL',
    LIST: 'LIST'
} as const;

export const AlignmentType = {
    LEFT: 'LEFT',
    CENTER: 'CENTER',
    RIGHT: 'RIGHT'
} as const;

export const DestinationType = {
    WHATSAPP: 'WHATSAPP',
    EMAIL: 'EMAIL'
} as const;

// Depois definimos os tipos baseados nos objetos
export type HeaderModel = typeof HeaderModel[keyof typeof HeaderModel];
export type SectionType = typeof SectionType[keyof typeof SectionType];
export type SizeType = typeof SizeType[keyof typeof SizeType];
export type ColorPalette = typeof ColorPalette[keyof typeof ColorPalette];
export type LayoutType = typeof LayoutType[keyof typeof LayoutType];
export type AlignmentType = typeof AlignmentType[keyof typeof AlignmentType];
export type DestinationType = typeof DestinationType[keyof typeof DestinationType];

// Interfaces
import { IAdvertiser } from "./IAdvertiser";

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

interface ISocialLinks {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
}

// Adicionando interface para seções do footer
interface IFooterSection {
    title: string;
    links: Array<{
        label: string;
        url: string;
    }>;
}

interface ITemplateFooter {
    color: string;
    sizeType: SizeType;
    sections?: Record<string, IFooterSection>; // Mudando para um objeto de seções
    socialLinks: ISocialLinks;
    companyName: string;
    showSocialLinks: boolean;
    textColor: string;
    borderColor: string;
    elementsOpacity: number;
}

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

export { 
    ISiteTemplate, 
    ITemplateSections,
    ITemplateHeader,
    ITemplateFooter,
    IHeaderText,
    IHeaderCarousel,
    ISocialLinks,
    IFooterSection // Exportando nova interface
};
