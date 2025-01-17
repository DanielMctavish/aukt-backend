import { AuctResponse } from "../../IMainAuct";
import PrismaAuctRepositorie from "../../../repositorie/database/PrismaAuctRepositorie";
import PrismaAuctDateRepositorie from "../../../repositorie/database/PrismaAuctDateRepositorie";
import PrismaProductRepositorie from "../../../repositorie/database/PrismaProductRepositorie";
import { PrismaClient } from "@prisma/client";
import { deleteSingleImage } from "../../../../utils/Firebase/FirebaseOperations";

const prisma = new PrismaClient();
const prismaAuct = new PrismaAuctRepositorie();
const prismaAuctDate = new PrismaAuctDateRepositorie();
const prismaProduct = new PrismaProductRepositorie();

const safeDeleteImage = async (imageUrl: string) => {
    try {
        await deleteSingleImage(imageUrl);
    } catch (error) {
        // Apenas loga o erro e continua a execução
        console.log(`Imagem não encontrada ou já deletada: ${imageUrl}`);
    }
};

export const deleteAuct = (id: string): Promise<AuctResponse> => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                return reject({ status_code: 403, body: "not auct_id sended" });
            }

            const currentAuct = await prismaAuct.find(id);

            if (!currentAuct) {
                return reject({ status_code: 404, body: "not auct founded" });
            }

            try {
                // Primeiro, deletar todas as cartelas associadas ao leilão
                await prisma.cartela.deleteMany({
                    where: {
                        auction_id: id
                    }
                });

                // Deletar todas as datas do leilão
                await prismaAuctDate.deleteMany(id);

                // Buscar e deletar todos os produtos
                const allCurrentProducts = await prismaProduct.list({ auct_id: id });

                // Deletar imagens e produtos
                for (const product of allCurrentProducts) {
                    // Tenta deletar imagens, mas não interrompe se falhar
                    try {
                        if (product.cover_img_url) {
                            await safeDeleteImage(product.cover_img_url);
                        }

                        if (Array.isArray(product.group_imgs_url) && product.group_imgs_url.length > 0) {
                            for (const img of product.group_imgs_url) {
                                if (img) {
                                    await safeDeleteImage(img);
                                }
                            }
                        }
                    } catch (imageError) {
                        console.log("Erro ao deletar imagens do produto, continuando...");
                    }

                    // Deleta o produto independentemente do resultado das imagens
                    await prismaProduct.delete(product.id);
                }

                // Tenta deletar imagem de capa do leilão, mas não interrompe se falhar
                try {
                    if (currentAuct.auct_cover_img && currentAuct.auct_cover_img !== '') {
                        await safeDeleteImage(currentAuct.auct_cover_img);
                    }
                } catch (coverError) {
                    console.log("Erro ao deletar imagem de capa, continuando...");
                }

                // Deleta o leilão independentemente do resultado das imagens
                await prismaAuct.delete(id);

                return resolve({ status_code: 200, body: "auct deleted" });

            } catch (operationError: any) {
                // Se houver erro nas operações principais (não relacionadas a imagens)
                return reject({
                    status_code: 500,
                    body: "Error in auction deletion operations: " + operationError
                });
            }

        } catch (error: any) {
            return reject({
                status_code: 500,
                body: "Error in initial auction validation: " + error.message
            });
        }
    });
};