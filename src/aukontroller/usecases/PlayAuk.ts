import { FLOOR_STATUS, IEngineFloorStatus } from "../IMainAukController";
import PrismaAuctRepositorie from "../../app/repositorie/database/PrismaAuctRepositorie";
import EngineMaster from "../engine/EngineMaster";
import { getAukSocket, setAukSocket, resetAukSockets } from "../engine/EngineSocket";
import axios from "axios";

const prismaAuk = new PrismaAuctRepositorie();

async function playAuk(
    auct_id: string,
    group: string,
    resume_count?: number,
    resume_product_id?: string
): Promise<Partial<IEngineFloorStatus>> {

    return new Promise(async (resolve) => {
        const currentSocketAuk = getAukSocket();
        if (currentSocketAuk.status === FLOOR_STATUS.PLAYING) {
            return resolve({
                response: {
                    status: 400,
                    body: "Já existe um leilão em andamento"
                }
            });
        }

        resetAukSockets();

        const currentAuct = await prismaAuk.find(auct_id);
        if (!currentAuct) {
            return resolve({
                response: {
                    status: 404,
                    body: "Leilão não encontrado"
                }
            });
        }

        const groupStatus = currentAuct.auct_dates.find(group_date => group_date.group === group);
        if (groupStatus?.group_status === 'finished') {
            return resolve({
                response: {
                    status: 400,
                    body: "Grupo de leilão já finalizado"
                }
            });
        }

        if (groupStatus?.group_status !== "cataloged") {
            return resolve({
                response: {
                    status: 400,
                    body: "Grupo de Leilão não está catalogado"
                }
            });
        }

        const socket_message = `${currentAuct.id}-playing-auction`;

        // Enviar mensagem imediata de início do leilão
        try {
            await axios.post(`${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${socket_message}`, {
                body: {
                    auct_id: auct_id,
                    group: group,
                    status: "started"
                }
            });
        } catch (error: any) {
            console.error("Erro ao enviar mensagem de início do leilão:", error.message);
        }

        await setAukSocket({
            auct_id,
            status: FLOOR_STATUS.PLAYING,
            group: group,
            nextProductIndex: 0,
            timer: resume_count ?? 0
        });

        EngineMaster(currentAuct, group, socket_message, resume_count, resume_product_id)
            .then(() => {
                console.log("Leilão finalizado");
            })
            .catch((error) => {
                console.error("Erro durante a execução do leilão:", error);
            });

        resolve({
            response: {
                status: 200,
                body: {
                    message: "Leilão iniciado com sucesso",
                    auct_id: auct_id
                }
            }
        });
    });
}

export { playAuk };
