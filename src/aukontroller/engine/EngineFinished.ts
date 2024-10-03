import { IAuct } from "../../app/entities/IAuct";
import PrismaAuctDateRepositorie from "../../app/repositorie/database/PrismaAuctDateRepositorie";
import PrismaAuctRepositorie from "../../app/repositorie/database/PrismaAuctRepositorie";
import axios from "axios"
import { resetAukSockets, setAukSocket, FLOOR_STATUS } from "./EngineSocket";

const prismaAuct = new PrismaAuctRepositorie();
const prismaAuctDate = new PrismaAuctDateRepositorie();

export const EngineFinished = async (resolve: any, currentAuct: IAuct, group: string) => {
    console.log("Fim do leilão!");

    // Atualizando o status do grupo específico
    const groupToUpdate = await prismaAuct.find(currentAuct.id);
    await prismaAuct.update({ status: "cataloged" }, currentAuct.id);

    if (groupToUpdate) {
        const groupDate = groupToUpdate.auct_dates.find(date => date.group === group);
        if (groupDate) {
            await prismaAuctDate.update({ group_status: "finished" }, groupDate.id);
        }
    }

    // Atualiza o status do leilão para COMPLETED antes de resetar
    await setAukSocket({
        status: FLOOR_STATUS.COMPLETED
    });

    // Envio de mensagem de finalização
    try {
        await axios.post(`${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${currentAuct.id}-auct-finished`, {
            body: {
                auct_id: currentAuct.id,
                group: group,
                status: "finished"
            }
        });
    } catch (error: any) {
        console.error("Erro ao enviar mensagem de finalização:", error.response);
    }

    // Reseta os sockets após enviar a mensagem de finalização
    resetAukSockets();

    resolve(null);
}