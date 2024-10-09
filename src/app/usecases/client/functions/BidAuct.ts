import IBid from "../../../entities/IBid";
import axios from "axios";
import { ClientResponse } from "../../IMainClient";
import PrismaBidRepositorie from "../../../repositorie/database/PrismaBidRepositorie";
import PrismaProductRepositorie from "../../../repositorie/database/PrismaProductRepositorie";
import PrismaAdvertiserRepositorie from "../../../repositorie/database/PrismaAdvertiserRepositorie";
import PrismaAuctRepositorie from "../../../repositorie/database/PrismaAuctRepositorie";
import { IProduct } from "../../../entities/IProduct";
import { IAdvertiser } from "../../../entities/IAdvertiser";
import { IClient } from "../../../entities/IClient";

const prismaBid = new PrismaBidRepositorie();
const prismaAdvertiser = new PrismaAdvertiserRepositorie();
const prismaProduct = new PrismaProductRepositorie();
const prismaAuct = new PrismaAuctRepositorie();

export const bidAuct = async (data: IBid): Promise<ClientResponse> => {
    try {
        const currentProduct: IProduct = data.Product;
        if (!currentProduct) {
            return { status_code: 404, body: "not product sent" };
        }

        const currentAuct = currentProduct.Auct;
        if (!currentAuct) {
            return { status_code: 404, body: "not auct sent" };
        }

        const currentAdvertiser: IAdvertiser | null = currentProduct.advertiser_id
            ? await prismaAdvertiser.find(currentProduct.advertiser_id)
            : null;

        if (currentAdvertiser && data.Client) {
            const IsClientExisted = currentAdvertiser.Clients ? currentAdvertiser.Clients.some(
                (client: IClient) => client.id === data.client_id
            ) : false;

            console.log("observando se existe cliente -> ", IsClientExisted)

            if (!IsClientExisted) {
                const currentClients = [...(currentAdvertiser.Clients || []), data.Client]

                await prismaAdvertiser.update(currentAdvertiser.id, {
                    Clients: currentClients
                })
            }
        }

        const currentBid = await prismaBid.CreateBid(data);

        // Listagem de lances e verificação de lance automático
        const allBids = currentProduct.Bid || [];
        let highestBid = currentBid;

        const tempRegisterClientsBid: IBid[] = []

        for (const bid of allBids) {
            console.log("observando bid -> ", bid.cover_auto)

            const isClientRepeated = tempRegisterClientsBid.find(bid => bid.client_id === bid.client_id)
            if (isClientRepeated) {
                continue
            }

            if (bid.cover_auto) {
                // Cria um novo lance automático
                const autoBidValue = highestBid.value + 20; // Incremento mínimo
                const autoBidData: IBid = {
                    ...bid,
                    value: autoBidValue,
                    product_id: data.product_id, // Garante que o product_id seja passado
                };

                try {
                    // Cria o lance automático no banco de dados
                    const newAutoBid = await prismaBid.CreateBid(autoBidData);
                    console.log("Lance automático criado com sucesso:", newAutoBid);
                    highestBid = newAutoBid;
                    tempRegisterClientsBid.push(newAutoBid)

                    // Envia o lance automático para o WebSocket
                    await axios.post(`${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${data.auct_id}-bid`, {
                        body: newAutoBid,
                    });
                } catch (error) {
                    console.error("Erro ao criar lance automático:", error);
                }
            }
        }

        if (data.product_id) {
            await prismaProduct.update(
                {
                    initial_value: highestBid.value,
                },
                data.product_id
            );
        }

        // Envia o lance original para o WebSocket
        await axios.post(`${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${data.auct_id}-bid`, {
            body: currentBid,
        });

        return { status_code: 200, body: highestBid };
    } catch (error: any) {
        return { status_code: 500, body: error.message };
    }
};

