import IParams from "../../../entities/IParams";
import PrismaProductRepositorie from "../../../repositorie/database/PrismaProductRepositorie";
import PrismaBidRepositorie from "../../../repositorie/database/PrismaBidRepositorie";
import { ClientResponse } from "../../IMainClient";
import IBid from "../../../entities/IBid";

const prismaProduct = new PrismaProductRepositorie();
const prismaBid = new PrismaBidRepositorie();

interface DisableAutoBidParams extends IParams {
    product_id: string;
    client_id: string;
}

const DisableAutoBid = (params: DisableAutoBidParams): Promise<ClientResponse> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { product_id, client_id } = params;

            if (!product_id || !client_id) {
                return resolve({
                    status_code: 400,
                    body: "product_id e client_id são obrigatórios"
                });
            }

            // Busca o produto e seus lances
            const product = await prismaProduct.find({ product_id });
            if (!product) {
                return resolve({
                    status_code: 404,
                    body: "Produto não encontrado"
                });
            }

            // Filtra os lances automáticos do cliente
            const autoBids = product.Bid.filter((bid: IBid) => 
                bid.client_id === client_id && 
                bid.cover_auto === true
            );

            if (autoBids.length === 0) {
                return resolve({
                    status_code: 404,
                    body: "Nenhum lance automático encontrado para este cliente neste produto"
                });
            }

            console.log(`Desativando ${autoBids.length} lances automáticos do cliente ${client_id}`);

            // Desativa todos os lances automáticos do cliente neste produto
            for (const bid of autoBids) {
                await prismaBid.UpdateBid(bid.id, {
                    cover_auto: false,
                    cover_auto_limit: 0
                });
                console.log(`Lance automático ${bid.id} desativado`);
            }

            return resolve({
                status_code: 200,
                body: {
                    message: "Lances automáticos desativados com sucesso",
                    disabled_bids: autoBids.length
                }
            });

        } catch (error) {
            console.error("Erro ao desativar lances automáticos:", error);
            return reject({
                status_code: 500,
                body: "Erro ao desativar lances automáticos"
            });
        }
    });
};

export default DisableAutoBid; 