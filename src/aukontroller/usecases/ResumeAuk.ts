import { controllerInstance } from "../MainAukController";
import { IFloorStatus, FLOOR_STATUS } from "../IMainAukController"; // Certifique-se de importar FLOOR_STATUS
import IntervalEngine from "../engine/IntervalEngine";
import PrismaAuctRepositorie from "../../app/repositorie/database/PrismaAuctRepositorie";
import PrismaAuctDateRepositorie from "../../app/repositorie/database/PrismaAuctDateRepositorie";

const prismaAuct = new PrismaAuctRepositorie();
const prismaDateGroup = new PrismaAuctDateRepositorie();

async function resumeAuk(auct_id: string): Promise<Partial<IFloorStatus>> {
    return new Promise(async (resolve) => {
        const currentSocket = controllerInstance.auk_sockets.find((socket: any) => socket.auct_id === auct_id);
        const currentCount = currentSocket?.timer;
        const currentProductId = currentSocket?.product_id;
        const currentGroup = currentSocket?.group;

        const currentAuk = await prismaAuct.find(auct_id);
        const groupStatus = currentAuk?.auct_dates.find(group_date => group_date.group === currentSocket?.group)

        if (groupStatus?.group_status === "finished" || groupStatus?.group_status === "live" || !currentSocket) {
            return resolve({
                response: {
                    status: 400,
                    body: {
                        message: "auct finished or already live",
                    }
                }
            })
        }

        if (currentSocket && currentGroup && currentCount !== undefined) {

            currentSocket.status = FLOOR_STATUS.PLAYING;

            await prismaAuct.update({ status: "live" }, auct_id);
            const groupDate = currentAuk?.auct_dates.find(group_date => group_date.group === currentSocket.group)
            if (groupDate)
                await prismaDateGroup.update({ group_status: "live" }, groupDate?.id)

            clearInterval(currentSocket.interval);

            const sokect_message = `${auct_id}-playing-auction`;

            if (currentAuk) {
                IntervalEngine(currentAuk, currentGroup, sokect_message, currentCount, currentProductId);
            }

            resolve({
                response: {
                    status: 200,
                    body: {
                        message: "auct resumed successfully",
                        auct_id: auct_id
                    }
                }
            });

        } else {
            resolve({
                response: {
                    status: 404,
                    body: "auct not found or not playing"
                }
            });
        }
    });
}

export { resumeAuk };