interface IParams {
    product_id: string
    advertiserId: string
    creator_id:string
    title: string
    lote?: string
    take?: string
    skip?: string
    auct_id?: string
    categorie: string
    group?: string
    lote_order?: 'asc' | 'desc'
    initial_value_order?: 'asc' | 'desc'
    bid_count_order?: 'asc' | 'desc'
    created_at_order?: 'asc' | 'desc'
    min_initial_value?: number
    max_initial_value?: number
    min_reserve_value?: number
    max_reserve_value?: number
    has_winner?: boolean
    has_bids?: boolean
    highlight_only?: boolean
    min_width?: number
    max_width?: number
    min_height?: number
    max_height?: number
    min_weight?: number
    max_weight?: number
    created_after?: Date
    created_before?: Date
    description_contains?: string
    categories?: string[]
    groups?: string[]
}


export default IParams;