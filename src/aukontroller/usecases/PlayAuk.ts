import { FLOOR_STATUS, IEngineFloorStatus } from "../IMainAukController";
import PrismaAuctRepositorie from "../../app/repositorie/database/PrismaAuctRepositorie";
import EngineMaster from "../engine/EngineMaster";
import { getAukSocket, setAukSocket, resetAukSockets } from "../engine/EngineSocket";
import axios from "axios";

const prismaAuk = new PrismaAuctRepositorie();
// Verificar a configuração do WebSocket no início
const API_WEBSOCKET_URL = process.env.API_WEBSOCKET_AUK;
if (!API_WEBSOCKET_URL) {
    console.error("AVISO: Variável de ambiente API_WEBSOCKET_AUK não está definida!");
}
console.log(`Usando URL do WebSocket: ${API_WEBSOCKET_URL}`);

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
        console.log(`PlayAuk: Iniciando envio de mensagem WebSocket para ${socket_message}`);
        try {
            // Verificar novamente se a URL do WebSocket está disponível
            if (!API_WEBSOCKET_URL) {
                throw new Error("API_WEBSOCKET_AUK não está definido no ambiente");
            }
            
            console.log(`PlayAuk: URL do WebSocket: ${API_WEBSOCKET_URL}/main/sent-message?message_type=${socket_message}`);
            console.log(`PlayAuk: Corpo da mensagem:`, {
                body: {
                    auct_id: auct_id,
                    group: group,
                    status: "started"
                }
            });
            
            const response = await axios.post(
                `${API_WEBSOCKET_URL}/main/sent-message?message_type=${socket_message}`,
                {
                    body: {
                        auct_id: auct_id,
                        group: group,
                        status: "started"
                    }
                },
                // Adicionar timeout e cabeçalhos explícitos
                {
                    timeout: 5000,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            console.log(`PlayAuk: Mensagem WebSocket enviada com sucesso. Status: ${response.status}`);
        } catch (error: any) {
            // Melhorar o log de erro para incluir mais detalhes
            console.error("Erro ao enviar mensagem de início do leilão:");
            if (error.response) {
                // A requisição foi feita e o servidor respondeu com um status fora do range 2xx
                console.error(`Status: ${error.response.status}`);
                console.error(`Dados: ${JSON.stringify(error.response.data)}`);
                console.error(`Headers: ${JSON.stringify(error.response.headers)}`);
            } else if (error.request) {
                // A requisição foi feita mas não houve resposta
                console.error("Sem resposta do servidor. Verifique se o servidor WebSocket está rodando.");
                console.error(`Request: ${JSON.stringify(error.request)}`);
            } else {
                // Algo aconteceu ao configurar a requisição que causou o erro
                console.error(`Mensagem: ${error.message}`);
            }
            console.error(`Config: ${JSON.stringify(error.config)}`);
        }

        await setAukSocket({
            auct_id,
            status: FLOOR_STATUS.PLAYING,
            group: group,
            nextProductIndex: 0,
            timer: resume_count ?? 0
        });

        console.log(`PlayAuk: Chamando EngineMaster para leilão ${auct_id}, grupo ${group}`);
        EngineMaster(currentAuct, group, socket_message, resume_count, resume_product_id)
        console.log(`PlayAuk: EngineMaster iniciado com sucesso para leilão ${auct_id}`);

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
