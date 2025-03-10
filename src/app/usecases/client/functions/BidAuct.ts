import IBid from "../../../entities/IBid";
import axios from "axios";
import { ClientResponse } from "../../IMainClient";
import PrismaBidRepositorie from "../../../repositorie/database/PrismaBidRepositorie";
import PrismaProductRepositorie from "../../../repositorie/database/PrismaProductRepositorie";
import PrismaAdvertiserRepositorie from "../../../repositorie/database/PrismaAdvertiserRepositorie";
import PrismaAuctRepositorie from "../../../repositorie/database/PrismaAuctRepositorie";
import AuctionInspector from "../../inspector/AuctionInspector";
import { processAutoBids } from "./ProcessAutoBids";

const prismaBid = new PrismaBidRepositorie();
const prismaAdvertiser = new PrismaAdvertiserRepositorie();
const prismaProduct = new PrismaProductRepositorie();
const prismaAuct = new PrismaAuctRepositorie();

export const bidAuct = async (data: IBid, bidInCataloge?: string | boolean): Promise<ClientResponse> => {
    const currentProduct = await prismaProduct.find({ product_id: data.product_id });
    const currentAuct = await prismaAuct.find(data.auct_id);

    // Garantindo que bidInCataloge seja sempre um booleano, mesmo quando vier como string
    const isBidInCataloge = bidInCataloge === true || bidInCataloge === 'true';

    return new Promise(async (resolve, reject) => {
        try {
            if (!currentProduct) {
                return resolve({ status_code: 404, body: "Produto não encontrado" });
            }

            if (!currentAuct) {
                return resolve({ status_code: 404, body: "Leilão não encontrado" });
            }

            const dataValue = data.value;
            const initialValue = currentProduct.initial_value;
            const currentValue = currentProduct.real_value || initialValue;

            // Verificação do valor inicial primeiro (esse valor nunca muda)
            if (!currentProduct.real_value && dataValue < initialValue) {
                return resolve({
                    status_code: 400,
                    body: `value must be = or > ${initialValue} (initial value)`
                });
            }

            // Depois verifica o valor atual (real_value ou último lance)
            if (dataValue <= currentProduct.real_value) {
                return resolve({
                    status_code: 400,
                    body: `value must be > ${currentProduct.real_value} (current value/real_value)`
                });
            }

            if(currentProduct.winner_id){
                return resolve({
                    status_code: 400,
                    body: `Product already has a winner`
                });
            }

            // Verificação e atualização do anunciante
            const currentAdvertiser = currentProduct.advertiser_id
                ? await prismaAdvertiser.find(currentProduct.advertiser_id)
                : null;

            // Criação do lance
            const currentBid = await prismaBid.CreateBid(data);
            let highestBid = currentBid;

            try {
                // Atualização do anunciante se necessário
                if (currentAdvertiser && data.Client) {
                    const isClientExisted = currentAdvertiser.Clients?.some(
                        client => client.id === data.client_id
                    ) ?? false;

                    if (!isClientExisted) {
                        const currentClients = [...(currentAdvertiser.Clients || []), data.Client];
                        await prismaAdvertiser.update(currentAdvertiser.id, {
                            Clients: currentClients
                        });
                    }
                }

                // Atualizar o real_value do produto com o valor do lance atual
                await prismaProduct.update(
                    { real_value: dataValue },
                    data.product_id
                );

                // Calcular o incremento mínimo para lances automáticos
                let minIncrement = 20; // valor padrão
                if (currentAuct && currentAuct.value) {
                    const auctIncrement = parseFloat(currentAuct.value);
                    minIncrement = auctIncrement > 0 ? auctIncrement : minIncrement;
                }

                // Processar lances automáticos independentemente do lance atual ter cover_auto
                const result = await processAutoBids(
                    currentProduct,
                    currentBid,
                    isBidInCataloge,
                    minIncrement
                );

                // Atualiza o lance mais alto
                highestBid = result.highestBid;

                // Envio do lance para WebSocket
                const websocketEndpoint = isBidInCataloge 
                    ? `${data.auct_id}-bid-cataloged` 
                    : `${data.auct_id}-bid`;
                
                axios.post(
                    `${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${websocketEndpoint}`,
                    { body: currentBid }
                ).catch(() => { });

                // Após todos os lances serem processados, chamamos o inspetor
                const updatedProduct = await prismaProduct.find({ product_id: data.product_id });
                if (updatedProduct && updatedProduct.Bid) {
                    await AuctionInspector(updatedProduct.Bid);
                }

                return resolve({ status_code: 200, body: highestBid });
            } catch (error: any) {
                return reject({ status_code: 500, body: error.message });
            }
        } catch (error: any) {
            return reject({ status_code: 500, body: error.message });
        }
    });
};