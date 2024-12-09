import bcrypt from "bcrypt";
import { AdvertiserResponse } from "../../IMainAdvertiser";
import PrismaAdvertiserRepositorie from "../../../repositorie/database/PrismaAdvertiserRepositorie";
import { IAdvertiser } from "../../../entities/IAdvertiser";

const prismaAdvertiser = new PrismaAdvertiserRepositorie();

export const updateAdvertiser = (data: Partial<IAdvertiser>, advertiserId: string): Promise<AdvertiserResponse> => {
    console.log("update advertiser --> ", data, advertiserId);

    return new Promise(async (resolve, reject) => {
        try {
            // Validar se o ID foi fornecido
            if (!advertiserId || typeof advertiserId !== 'string') {
                return reject({ 
                    status_code: 400, 
                    body: "ID do anunciante é obrigatório" 
                });
            }

            // Verificar se o anunciante existe
            const advertiserExists = await prismaAdvertiser.find(advertiserId);
            if (!advertiserExists) {
                return reject({ 
                    status_code: 404, 
                    body: "Anunciante não encontrado" 
                });
            }

            // Criar objeto com os dados a serem atualizados
            let updateData: Partial<IAdvertiser> = { ...data };

            // Se a senha foi fornecida, fazer o hash
            if (data.password) {
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(data.password, salt);
                updateData.password = hash;
            } else {
                // Se não foi fornecida senha, remover o campo password do objeto de atualização
                delete updateData.password;
            }

            // Atualizar o anunciante
            const currentAdvertiser = await prismaAdvertiser.update(
                advertiserId, 
                updateData
            );

            return resolve({ 
                status_code: 200, 
                body: currentAdvertiser 
            });

        } catch (error: any) {
            console.error("Error in updateAdvertiser:", error);
            return reject({ 
                status_code: error.status_code || 500, 
                body: error.message || "Erro interno do servidor" 
            });
        }
    });
};