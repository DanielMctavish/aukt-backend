import { IFloorStatus } from "../IMainAukController";
import PrismaAuctRepositorie from "../../app/repositorie/database/PrismaAuctRepositorie";
import IntervalEngine from "../engine/IntervalEngine";
import { controllerInstance } from "../MainAukController";

const prismaAuk = new PrismaAuctRepositorie();

async function playAuk(auct_id: string,
    group: string,
    resume_count?: number,
    resume_product_id?: string): Promise<Partial<IFloorStatus>> {

    return new Promise(async (resolve) => {
        const currentAuct = await prismaAuk.find(auct_id);

        if (!currentAuct) {
            return resolve({
                response: {
                    status: 404,
                    body: "Leilão não encontrado"
                }
            });
        }

        // Filtrando o auct_dates pelo grupo
        const groupStatus = currentAuct.auct_dates.find(group_date => group_date.group === group)

        console.log('observando status -> ', groupStatus);

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

        // Se chegar aqui, significa que o leilão pode começar
        const socket_message = `${currentAuct.id}-playing-auction`;

        const result = await IntervalEngine(currentAuct, group, socket_message, resume_count, resume_product_id);

        // Verificar se já existe um intervalo do mesmo leilão na memória
        const currentIntervalAuk = controllerInstance.auk_sockets.find(socket => socket.auct_id === result?.auct_id);
        if (currentIntervalAuk) {
            return resolve({
                response: {
                    status: 400,
                    body: "Já existe um intervalo ativo para este leilão"
                }
            });
        }

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
