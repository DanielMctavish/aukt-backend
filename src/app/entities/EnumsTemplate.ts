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
    PRODUCT_CAROUSEL: 'PRODUCT_CAROUSEL',
    FORM: 'FORM',
    GALLERY: 'GALLERY',
    AUCT_LIST: 'AUCT_LIST',
    TEXT: 'TEXT',
    TESTIMONIALS: 'TESTIMONIALS',
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