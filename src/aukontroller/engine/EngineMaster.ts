import { IAuct } from "../../app/entities/IAuct";
import { IEngineFloorStatus } from "../IMainAukController";
import { EngineFilters } from "./EngineFilters";
import { EngineFinished } from "./EngineFinished";
import { IProduct } from "../../app/entities/IProduct";
import { EngineInterval } from "./EngineInterval";
import { resetAukSockets, getAukSocket, setAukSocket } from "./EngineSocket";

async function EngineMaster(currentAuct: IAuct,
    group: string,
    sokect_message: string,
    resume_count?: number,
    resume_product_id?: string,
    increment?: number): Promise<Partial<IEngineFloorStatus> | null> {

    return new Promise(async (resolve) => {
        let currentProductIndex = getAukSocket().nextProductIndex ?? 0;

        while (true) {
            const filterResponse: IProduct | false = await EngineFilters(resolve, currentAuct, group, resume_product_id);

            if (!filterResponse) {
                await EngineFinished(resolve, currentAuct, group);
                return;
            }

            let count: number = resume_count !== undefined ? resume_count : 0;

            await setAukSocket({
                product_id: filterResponse.id,
                nextProductIndex: currentProductIndex
            });

            const result = await EngineInterval(resolve, currentAuct, filterResponse, count, sokect_message, group);

            if (result === null) {
                // O leilão foi encerrado ou pausado
                break;
            }

            // Atualiza o índice do próximo produto
            currentProductIndex = getAukSocket().nextProductIndex ?? 0;
            resume_count = undefined;
            resume_product_id = undefined;
        }

        resolve({ auct_id: currentAuct.id });
    });
}

export default EngineMaster;