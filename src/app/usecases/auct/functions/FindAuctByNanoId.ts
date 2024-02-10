import { AuctResponse } from "../../IMainAuct";
import PrismaAuctRepositorie from "../../../repositorie/database/PrismaAuctRepositorie";

const prismaAuct = new PrismaAuctRepositorie()

const findAuctByNanoId = async (nano_id: string): Promise<AuctResponse> => {

    try {
        if (!nano_id) {
            return { status_code: 404, body: 'no data sended' }
        }

        const currentAuct = await prismaAuct.findByNanoId(nano_id)
        if (!currentAuct) {
            return { status_code: 404, body: 'not auct founded' }
        } else {
            return { status_code: 200, body: currentAuct }
        }


    } catch (error: any) {
        return {
            status_code: 404,
            body: error
        }
    }

}

export default findAuctByNanoId;