

export interface ICreditCard {
    id: string;
    admin_id?: string | any
    advertiser_id?: string | any
    client_id?: string | any
    cardNumber: string;
    cardHolderName: string;
    expirationDate: string;
    cvv: string;
    cardType: CardType;
    created_at: Date
    updated_at: Date
}



const CardType: { [x: string]: 'Visa' | 'MasterCard' | 'AmericanExpress' | 'Discover' | 'Elo' | 'DEFAULT' } = {
    Visa: 'Visa',
    MasterCard: 'MasterCard',
    AmericanExpress: 'AmericanExpress',
    Discover: 'Discover',
    Elo: 'Elo',
    DEFAULT: 'DEFAULT'
}

export type CardType = typeof CardType[keyof typeof CardType]
