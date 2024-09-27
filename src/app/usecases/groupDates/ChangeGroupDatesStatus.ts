import { AuctDateGroups } from "@prisma/client"
import PrismaAuctDateRepositorie from "../../repositorie/database/PrismaAuctDateRepositorie"
import { GroupDatesResponse } from "../IMainGroupDates";

const prismaDateGroup = new PrismaAuctDateRepositorie()

const ChangeGroupDatesStatus = async (data: AuctDateGroups, date_group_id: string): Promise<GroupDatesResponse> => {
    return new Promise(async (resolve, reject) => {
        try {
            // Verifica se o ID do grupo de datas foi fornecido
            if (!date_group_id) {
                return reject({
                    status_code: 400,
                    body: "date_group_id not provided"
                });
            }

            // Verifica se os dados necessários estão presentes
            if (!data) {
                return reject({ status_code: 400, body: 'no data provided' });
            }

            // Tenta atualizar o grupo de datas
            const updatedGroup = await prismaDateGroup.update(data, date_group_id);
            if (!updatedGroup) {
                return reject({
                    status_code: 500,
                    body: "Failed to update date group"
                });
            }

            resolve({ status_code: 200, body: { ...updatedGroup } });

        } catch (error: any) {
            console.log("Erro na função ChangeGroupDatesStatus:", error);
            reject({ status_code: 500, body: error.message });
        }
    });
}

export { ChangeGroupDatesStatus }