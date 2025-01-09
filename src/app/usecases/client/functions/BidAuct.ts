import IBid from "../../../entities/IBid";
import axios from "axios";
import { ClientResponse } from "../../IMainClient";
import PrismaBidRepositorie from "../../../repositorie/database/PrismaBidRepositorie";
import PrismaProductRepositorie from "../../../repositorie/database/PrismaProductRepositorie";
import PrismaAdvertiserRepositorie from "../../../repositorie/database/PrismaAdvertiserRepositorie";
import PrismaAuctRepositorie from "../../../repositorie/database/PrismaAuctRepositorie";

const prismaBid = new PrismaBidRepositorie();
const prismaAdvertiser = new PrismaAdvertiserRepositorie();
const prismaProduct = new PrismaProductRepositorie();
const prismaAuct = new PrismaAuctRepositorie();

export const bidAuct = async (data: IBid, bidInCataloge?: string | boolean): Promise<ClientResponse> => {
    const currentProduct = await prismaProduct.find({ product_id: data.product_id });
    const currentAuct = await prismaAuct.find(data.auct_id);

    // Garantindo que bidInCataloge seja sempre um booleano, mesmo quando vier como string
    const isBidInCataloge = bidInCataloge === true || bidInCataloge === 'true';

    console.log("observando produto atual -> ", data.product_id)

    return new Promise(async (resolve, reject) => {
        try {
            if (!currentProduct) {
                return resolve({ status_code: 404, body: "Produto não encontrado" });
            }

            if (!currentAuct) {
                return resolve({ status_code: 404, body: "Leilão não encontrado" });
            }

            // Buscar o último lance para ter o valor mais atualizado
            const lastBid = currentProduct.Bid?.[0];
            const currentValue = lastBid ? lastBid.value : currentProduct.real_value;
            const dataValue = data.value;
            const initialValue = currentProduct.initial_value;

            // Verificação do valor inicial primeiro (esse valor nunca muda)
            if (dataValue <= initialValue) {
                return resolve({
                    status_code: 400,
                    body: `value must be > ${initialValue} (initial value)`
                });
            }

            // Depois verifica o valor atual (real_value ou último lance)
            if (dataValue <= currentValue) {
                return resolve({
                    status_code: 400,
                    body: `value must be > ${currentValue} (current value)`
                });
            }

            // Verificação e atualização do anunciante
            const currentAdvertiser = currentProduct.advertiser_id
                ? await prismaAdvertiser.find(currentProduct.advertiser_id)
                : null;

            // Criação do lance
            const currentBid = await prismaBid.CreateBid(data);
            let highestBid = currentBid;
            const tempRegisterClientsBid = new Set<string>();

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

                // Processamento dos lances automáticos
                const allBids = currentProduct.Bid || [];

                console.log("observando cover_auto -> ", data.cover_auto)

                if (data.cover_auto) {
                    for (const bid of allBids) {
                        if (tempRegisterClientsBid.has(bid.client_id)) continue;

                        if (bid.cover_auto && bid.value < highestBid.value) {
                            const autoBidValue = highestBid.value + 20;
                            const autoBidData: IBid = {
                                ...bid,
                                value: autoBidValue,
                                product_id: data.product_id,
                            };

                            const newAutoBid = await prismaBid.CreateBid(autoBidData);

                            if (newAutoBid.value > highestBid.value) {
                                highestBid = newAutoBid;
                            }

                            tempRegisterClientsBid.add(newAutoBid.client_id);

                            // Definindo o endpoint do WebSocket
                            let websocketEndpoint;
                            if (isBidInCataloge) {
                                websocketEndpoint = `${data.auct_id}-bid-cataloged`;
                            } else {
                                websocketEndpoint = `${data.auct_id}-bid`;
                            }

                            // Envio do lance automático para WebSocket
                            axios.post(
                                `${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${websocketEndpoint}`,
                                { body: newAutoBid }
                            ).catch(() => { });
                        }
                    }
                } else {

                    let websocketEndpoint;
                    if (isBidInCataloge) {
                        websocketEndpoint = `${data.auct_id}-bid-cataloged`;
                    } else {
                        websocketEndpoint = `${data.auct_id}-bid`;
                    }

                    // Envio do lance para WebSocket
                    axios.post(`${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${websocketEndpoint}`,
                        {
                            body: currentBid
                        }
                    ).catch(() => { });
                }

                // Atualização do valor do produto
                if (data.product_id) {
                    await prismaProduct.update(
                        {
                            real_value: dataValue
                        },
                        data.product_id
                    );
                }

                // Envio do lance original para WebSocket
                let finalWebsocketEndpoint = `${data.auct_id}-bid`;

                axios.post(
                    `${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${finalWebsocketEndpoint}`,
                    { body: currentBid }
                ).catch(() => { });

                return resolve({ status_code: 200, body: highestBid });
            } catch (error: any) {
                return reject({ status_code: 500, body: error.message });
            }
        } catch (error: any) {
            return reject({ status_code: 500, body: error.message });
        }
    });
};

