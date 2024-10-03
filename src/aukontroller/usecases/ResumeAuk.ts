import { IEngineFloorStatus, FLOOR_STATUS } from "../IMainAukController";
import EngineMaster from "../engine/EngineMaster";
import PrismaAuctRepositorie from "../../app/repositorie/database/PrismaAuctRepositorie";
import PrismaAuctDateRepositorie from "../../app/repositorie/database/PrismaAuctDateRepositorie";
import { auk_sockets, setAukSocket } from "../engine/EngineSocket";



const prismaAuk = new PrismaAuctRepositorie();
const prismaDateGroup = new PrismaAuctDateRepositorie();

async function resumeAuk(auct_id: string): Promise<Partial<IEngineFloorStatus>> {
    return new Promise(async (resolve) => {
        
        const currentCount = auk_sockets?.timer;
        const currentProductId = auk_sockets?.product_id;
        const currentGroup = auk_sockets?.group;

        const currentAuk = await prismaAuk.find(auct_id);

        if (auk_sockets && currentGroup && currentCount !== undefined) {
            setAukSocket({status:FLOOR_STATUS.PLAYING})

            await prismaAuk.update({ status: "live" }, auct_id);

            const groupDate = currentAuk?.auct_dates.find(group_date => group_date.group === auk_sockets.group);
            if (groupDate) {
                await prismaDateGroup.update({ group_status: "live" }, groupDate?.id);
            }

            clearInterval(auk_sockets.interval);

            const socket_message = `${auct_id}-playing-auction`;

            if (currentAuk) {
                EngineMaster(currentAuk, currentGroup, socket_message, currentCount, currentProductId);
            }

            resolve({
                response: {
                    status: 200,
                    body: {
                        message: "Leilão retomado com sucesso",
                        auct_id: auct_id
                    }
                }
            });

        } else {
            resolve({
                response: {
                    status: 404,
                    body: "Leilão não encontrado ou não está em um estado retomável"
                }
            });
        }
    });
}

export { resumeAuk };