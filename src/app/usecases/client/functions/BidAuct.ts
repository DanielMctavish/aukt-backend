import IBid from "../../../entities/IBid";
import axios from "axios";
import { ClientResponse } from "../../IMainClient";
import PrismaBidRepositorie from "../../../repositorie/database/PrismaBidRepositorie";
import PrismaProductRepositorie from "../../../repositorie/database/PrismaProductRepositorie";
import PrismaAdvertiserRepositorie from "../../../repositorie/database/PrismaAdvertiserRepositorie";
import PrismaAuctRepositorie from "../../../repositorie/database/PrismaAuctRepositorie";
import AuctionInspector from "../../inspector/AuctionInspector";
import ProcessAutoBids from "./ProcessAutoBids";


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

            if (currentProduct.winner_id) {
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
            console.log("1. Iniciando criação do lance")
            const currentBid = await prismaBid.CreateBid(data);
            console.log("2. Lance criado com sucesso")
            let highestBid: any = currentBid;

            try {
                // Atualização do anunciante se necessário
                if (currentAdvertiser && data.Client) {
                    console.log("3. Atualizando anunciante")
                    const isClientExisted = currentAdvertiser.Clients?.some(
                        client => client.id === data.client_id
                    ) ?? false;

                    if (!isClientExisted) {
                        const currentClients = [...(currentAdvertiser.Clients || []), data.Client];
                        await prismaAdvertiser.update(currentAdvertiser.id, {
                            Clients: currentClients
                        });
                    }
                    console.log("4. Anunciante atualizado")
                }

                // Atualizar o real_value do produto com o valor do lance atual
                console.log("5. Atualizando real_value do produto")
                await prismaProduct.update(
                    { real_value: dataValue },
                    data.product_id
                );
                console.log("6. real_value atualizado")

                // Enviar mensagem WebSocket
                console.log("7. Enviando mensagem WebSocket")
                const websocketEndpoint = isBidInCataloge
                    ? `${data.auct_id}-bid-cataloged`
                    : `${data.auct_id}-bid`;

                try {
                    // Apenas envie websocket para lances manuais (não automáticos)
                    if (!data.cover_auto) {
                        await axios.post(
                            `${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${websocketEndpoint}`,
                            { body: currentBid },
                            { timeout: 2000 }
                        );
                        console.log("8. Mensagem WebSocket enviada")
                    } else {
                        console.log("8. Lance automático, websocket será enviado pelo ProcessAutoBids")
                    }
                } catch (error: any) {
                    // Log do erro mas continua o fluxo
                    console.log("Erro ao enviar mensagem para WebSocket:", error.message);
                    console.log("8. Continuando processo mesmo com erro no WebSocket")
                }

                // Processar lances automáticos
                console.log("9. Iniciando processamento de lances automáticos >> ", currentAuct.status, isBidInCataloge)
                await ProcessAutoBids(data, currentProduct.id);

                // Após todos os lances serem processados, chamamos o inspetor
                console.log("11. Buscando produto atualizado para inspeção")
                const updatedProduct = await prismaProduct.find({ product_id: data.product_id });
                if (updatedProduct && updatedProduct.Bid) {
                    console.log("12. Iniciando inspeção")
                    await AuctionInspector(updatedProduct.Bid);
                    console.log("13. Inspeção finalizada")
                }

                console.log("14. Finalizando processo de lance")
                return resolve({ status_code: 200, body: highestBid });
            } catch (error: any) {
                return reject({ status_code: 500, body: error.message });
            }
        } catch (error: any) {
            return reject({ status_code: 500, body: error.message });
        }
    });
};