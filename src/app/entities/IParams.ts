interface IParams {
    product_id: string
    advertiser_id: string
    title: string
    take?: string
    skip?: string
    auct_id?:string
    categorie: string
    group?: string
    lote_order?: any
    initial_value_order?: any
    bid_count_order?: any
}


export default IParams;