import { AuctResponse } from "../../IMainAuct";
import PrismaAuctRepositorie from "../../../repositorie/database/PrismaAuctRepositorie";

const prismaAuction = new PrismaAuctRepositorie();

const getAllAuctions = async (): Promise<AuctResponse> => { // retorna 2 produtos de cada leilão = product_list
    return new Promise(async (resolve, reject) => {
        try {
            const auctions = await prismaAuction.listAllAuctions();

            if (!auctions || auctions.length === 0) {
                return resolve({
                    status_code: 404,
                    body: {
                        message: "Nenhum leilão encontrado",
                        data: []
                    }
                });
            }

            return resolve({
                status_code: 200,
                body: {
                    message: "Leilões encontrados com sucesso",
                    total: auctions.length,
                    data: auctions
                }
            });

        } catch (error: any) {
            console.error("Erro ao buscar leilões:", error);
            return reject({
                status_code: 500,
                body: {
                    message: error.message || "Erro interno ao buscar leilões",
                    error: error
                }
            });
        }
    });
};

export default getAllAuctions;