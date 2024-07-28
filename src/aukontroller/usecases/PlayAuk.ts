import { IFloorStatus } from "../IMainAukController";
import PrismaAuctRepositorie from "../../app/repositorie/database/PrismaAuctRepositorie";
import IntervalEngine from "../engine/IntervalEngine";
import { controllerInstance } from "../../http/http";

const prismaAuk = new PrismaAuctRepositorie();

async function playAuk(auct_id: string,
    group: string,
    resume_count?: number,
    resume_product_id?: string): Promise<Partial<IFloorStatus>> {

    return new Promise(async (resolve, reject) => {

        const currentAuct = await prismaAuk.find(auct_id)
        if (!currentAuct) {
            return reject({
                response: {
                    status: 404,
                    body: "auct not found"
                }
            })
        }
        resolve({
            response: {
                status: 200,
                body: {
                    message: "auct started successfully",
                    auct_id: auct_id
                }
            }
        })

        if (currentAuct.status === "cataloged") {
            const sokect_message = `${currentAuct.id}-playing-auction`

            IntervalEngine(currentAuct, group, sokect_message, resume_count, resume_product_id)
                .then((result) => {
                    //verificar se já existe um intervalo do mesmo leilão na memória.....
                    const currentIntervalAuk = controllerInstance.auk_sockets
                        .find(socket => socket.auct_id === result?.auct_id)
                    if (currentIntervalAuk) return null
                })

        }

    })

}


export { playAuk }