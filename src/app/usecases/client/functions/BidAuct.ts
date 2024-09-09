import IBid from "../../../entities/IBid";
import axios from "axios";
import { ClientResponse } from "../../IMainClient";
import PrismaBidRepositorie from "../../../repositorie/database/PrismaBidRepositorie";
import PrismaProductRepositorie from "../../../repositorie/database/PrismaProductRepositorie";
import PrismaAdvertiserRepositorie from "../../../repositorie/database/PrismaAdvertiserRepositorie";
import { IProduct } from "../../../entities/IProduct";
import { IAdvertiser } from "../../../entities/IAdvertiser";
import { IClient } from "../../../entities/IClient";

const prismaBid = new PrismaBidRepositorie();
const prismaAdvertiser = new PrismaAdvertiserRepositorie();
const prismaProduct = new PrismaProductRepositorie();

export const bidAuct = async (data: IBid): Promise<ClientResponse> => {
    try {

        // Cria o lance no banco de dados
        const currentBid = await prismaBid.CreateBid(data);

        const currentProduct: IProduct = data.Product;
        if (!currentProduct) {
            return { status_code: 404, body: "not product sent" };
        }

        const currentAdvertiser: IAdvertiser | null = currentProduct.advertiser_id
            ? await prismaAdvertiser.find(currentProduct.advertiser_id)
            : null;

        if (currentAdvertiser && data.Client) {
            const IsClientExisted = await currentAdvertiser.Clients?.some(
                (client: IClient) => client.id === data.client_id
            );

            console.log("observando se existe cliente -> ", IsClientExisted)

            if (!IsClientExisted) {
                const currentClients = [...(currentAdvertiser.Clients || []), data.Client]

                await prismaAdvertiser.update(currentAdvertiser.id, {
                    Clients: currentClients
                }).then(result => {
                    console.log("operação update -> ", result)
                })
            }
        }

        if (data.product_id) {
            await prismaProduct.update(
                {
                    initial_value: currentBid.value,
                },
                data.product_id
            );
        }

        await axios.post(`${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${data.auct_id}-bid`, {
            body: data,
        });

        return { status_code: 200, body: currentBid };
    } catch (error: any) {
        return { status_code: 500, body: error.message };
    }
};

