import { io } from "socket.io-client";
import axios from "axios";
import PrismaProductRepositorie from "../../app/repositorie/database/PrismaProductRepositorie";
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
                await axios.post(`${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${sokect_message}`, {
                    body: {
                        product: filterResponse,
                        auct_id: currentAuct.id
                    },
                    cronTimer: localCount
                });
            } catch (error: any) {
                console.error("Error at try send message: ", error.response);
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
