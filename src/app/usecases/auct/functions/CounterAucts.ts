import { AdministratorResponse } from "../../IMainAdministrador";
import PrismaAuctRepositorie from "../../../repositorie/database/PrismaAuctRepositorie";

const prismaAuct = new PrismaAuctRepositorie()

const counterAucts = async (): Promise<AdministratorResponse> => {

    return new Promise(async (resolve, reject) => {

        try {
            const countAll = await prismaAuct.countAll()
            const countLive = await prismaAuct.countLive()
            const countCataloged = await prismaAuct.countCataloged()
            const countFinished = await prismaAuct.countFinished()

            resolve({
                status_code: 200, body: {
                    countAll: countAll,
                    countLive: countLive,
                    countCataloged: countCataloged,
                    countFinished: countFinished
                }
            })
        } catch (error: any) {

            reject({ status_code: 500, body: error.message })

        }

    })

}

export { counterAucts }