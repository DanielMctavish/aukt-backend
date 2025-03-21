import { io } from "socket.io-client";
import axios from "axios";
import { IProduct } from "../../app/entities/IProduct";
import { IAuct } from "../../app/entities/IAuct";
import { FLOOR_STATUS } from "../IMainAukController";
import { WinnerEngine } from "../winner-engine/WinnerEngine";
import { setAukSocket, getAukSocket } from "./EngineSocket";
const websocketUrl = process.env.WS_WEBSOCKET_CONNECTION;
const socket = io(websocketUrl);

socket.on('connect', () => { });

export const EngineInterval = async (
    resolve: any,
    currentAuct: IAuct,
    filterResponse: IProduct | false,
    count: number,
    sokect_message: string,
    group: string
): Promise<{ auct_id: string; nextProductIndex: number } | null> => {
    return new Promise((intervalResolve) => {
        let intervalId: NodeJS.Timeout | undefined = undefined;
        let isIntervalRunning = false;
        let localCount = count;

        const clearAllListeners = () => {
            socket.removeAllListeners(`${currentAuct.id}-bid`);
            socket.removeAllListeners(`${currentAuct.id}-auct-finished`);
        };

        const runInterval = async () => {
            if (isIntervalRunning) return;
            isIntervalRunning = true;

            const currentSocketAuk = getAukSocket();

            if (currentSocketAuk.status === FLOOR_STATUS.COMPLETED || !filterResponse) {
                if (intervalId) clearInterval(intervalId);
                clearAllListeners();
                return intervalResolve(null);
            }

            try {
                console.log(`EngineInterval: Enviando mensagem tipo ${sokect_message} para leilão ${currentAuct.id}`);
                
                if (!process.env.API_WEBSOCKET_AUK) {
                    console.error("ERRO: API_WEBSOCKET_AUK não está definido no ambiente!");
                }
                
                const websocketUrl = process.env.API_WEBSOCKET_AUK;
                console.log(`EngineInterval: URL do WebSocket: ${websocketUrl}/main/sent-message?message_type=${sokect_message}`);
                
                const messageData = {
                    body: {
                        product: filterResponse,
                        auct_id: currentAuct.id
                    },
                    cronTimer: localCount
                };
                
                const response = await axios.post(
                    `${websocketUrl}/main/sent-message?message_type=${sokect_message}`,
                    messageData,
                    {
                        timeout: 5000,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
                
                console.log(`EngineInterval: Mensagem WebSocket enviada com sucesso. Status: ${response.status}`);
            } catch (error: any) {
                console.error("Error at try send message: ");
                if (error.response) {
                    console.error(`Status: ${error.response.status}`);
                    console.error(`Dados: ${JSON.stringify(error.response.data)}`);
                } else if (error.request) {
                    console.error("Sem resposta do servidor. Verifique se o servidor WebSocket está rodando.");
                } else {
                    console.error(`Mensagem: ${error.message}`);
                }
            }

            localCount++;

            await setAukSocket({
                timer: localCount,
                interval: intervalId,
                auct_id: currentAuct.id,
                group: group,
                status: FLOOR_STATUS.PLAYING
            });


            if (localCount >= currentAuct.product_timer_seconds + 1) {
                if (intervalId) clearInterval(intervalId);
                clearAllListeners();

                if (currentSocketAuk) {
                    currentSocketAuk.product_id = filterResponse.id;
                }

                await WinnerEngine(currentAuct.id, filterResponse.id);

                const nextIndex = (currentSocketAuk.nextProductIndex ?? 0) + 1;
                await setAukSocket({
                    nextProductIndex: nextIndex
                });

                return intervalResolve({ auct_id: currentAuct.id, nextProductIndex: nextIndex });
            }

            isIntervalRunning = false;
        };

        intervalId = setInterval(runInterval, 1000);

        socket.on(`${currentAuct.id}-bid`, async (data) => {

            const timerRemainings = currentAuct.product_timer_seconds - localCount;
            if (timerRemainings <= 6) {
                localCount -= 3;
                await setAukSocket({ timer: localCount });
            }
        });

        socket.on(`${currentAuct.id}-auct-finished`, () => {
            if (intervalId) clearInterval(intervalId);
            clearAllListeners();
            intervalResolve(null);
        });
    });
};
