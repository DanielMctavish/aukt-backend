import { FLOOR_STATUS, IFloorStatus } from "../IMainAukController";
import { controllerInstance } from "../MainAukController";
import PrismaAuctRepositorie from "../../app/repositorie/database/PrismaAuctRepositorie";
import PrismaAuctDateRepositorie from "../../app/repositorie/database/PrismaAuctDateRepositorie";

const prismaAukt = new PrismaAuctRepositorie();
const prismaDateGroup = new PrismaAuctDateRepositorie();

async function pauseAuk(auct_id: string): Promise<Partial<IFloorStatus>> {

    return new Promise(async (resolve) => {
        const currentAuction = await prismaAukt.find(auct_id);

        if (currentAuction?.status === "paused" || currentAuction?.status === "cataloged") {
            return resolve({
                response: {
                    status: 400,
                    body: "Auction already paused or cataloged"
                }
            });
        }

        const currentAuctionSocket = controllerInstance.auk_sockets.find(socket => socket.auct_id === auct_id);
        console.log("dentro do PAUSE -> ", currentAuctionSocket)

        if (!currentAuctionSocket) {
            return resolve({
                response: {
                    status: 404,
                    body: "Auction not found or out of memory"
                }
            });
        }

        clearInterval(currentAuctionSocket.interval);
        currentAuctionSocket.status = FLOOR_STATUS.PAUSED;

        const groupDate = currentAuction?.auct_dates.find(group_date => group_date.group === currentAuctionSocket.group);
        if (groupDate) {
            await prismaDateGroup.update({ group_status: "paused" }, groupDate?.id);
        }

        await prismaAukt.update({ status: "paused" }, auct_id);

        resolve({
            response: {
                status: 200,
                body: {
                    message: "Auction paused successfully",
                    auct_id: auct_id
                }
            }
        });
    });
}

export { pauseAuk };
