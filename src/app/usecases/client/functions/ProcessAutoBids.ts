import axios from "axios";
import IBid from "../../../entities/IBid";
import PrismaBidRepositorie from "../../../repositorie/database/PrismaBidRepositorie";
import PrismaProductRepositorie from "../../../repositorie/database/PrismaProductRepositorie";


interface T { }
const prismaBid = new PrismaBidRepositorie()
const prismaProduct = new PrismaProductRepositorie()

function ProcessAutoBids(dataBid: IBid, product_id: string): Promise<T> {

    return new Promise(async (resolve, reject) => {
        try {
            console.log("iniciando o processo de lances automáticos")
            //reunindo disputantes
            let disputantes: Partial<IBid>[] = []

            const currentProduct = await prismaProduct.find({ product_id })
            const allBids = currentProduct?.Bid

            if (allBids) {
                allBids.forEach(async (bid: IBid) => {
                    const disputante = disputantes.find((disputante: any) => disputante.client_id === bid.client_id)
                    if (!disputante && bid.id !== dataBid.id && bid.cover_auto_limit && bid.cover_auto_limit > 0) {
                        disputantes.push(bid)
                    }
                })
            }

            // criando um comportamento de testes:

            let finish = false

            disputantes.forEach(async (disputante: Partial<IBid>) => {
                console.log("disputante -> ", disputante.client_id)

                if (disputante.client_id) {
                    const newBidData: Partial<IBid> = {
                        client_id: disputante.client_id,
                        product_id: product_id,
                        value: 14000,
                        cover_auto: disputante.cover_auto,
                        cover_auto_limit: disputante.cover_auto_limit,
                        created_at: new Date(),
                        updated_at: new Date(),
                        auct_id: currentProduct?.auct_id
                    };

                    await prismaBid.CreateBid(newBidData as IBid);

                    await axios.post(`${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${dataBid.auct_id}-bid-cataloged`,
                        { body: newBidData }
                    ).catch(() => {
                        console.log("Erro ao enviar mensagem para WebSocket");
                    });
                }
            })

            resolve({})

        } catch (error) {
            reject(error)
        }
    })

}

export default ProcessAutoBids;