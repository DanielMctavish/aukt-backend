import { deleteSingleImage } from "../../../../../utils/Firebase/FirebaseOperations"
import { AuctResponse } from "../../../IMainAuct"
import PrismaAuctRepositorie from "../../../../repositorie/database/PrismaAuctRepositorie"
const prismaAuct = new PrismaAuctRepositorie()


interface params {
    auct_id: string
    creator_id: string
    url: string
}

const firebaseDeleteAuctCover = (params: params): Promise<AuctResponse> => {

    return new Promise(async (resolve, reject) => {

        try {

            if (!params.url) return reject({ status_code: 500, body: "parâmetro url é necessário!" })
            const currentImage = await deleteSingleImage(params.url)
            await prismaAuct.update({ auct_cover_img: "" }, params.auct_id)
            resolve({ status_code: 200, body: { currentImage } })

        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }

    })

}

export default firebaseDeleteAuctCover;