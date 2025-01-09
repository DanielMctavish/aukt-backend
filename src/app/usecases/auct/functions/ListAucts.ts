import { IAuct } from "../../../entities/IAuct";
import { AuctResponse } from "../../IMainAuct";
import PrismaAuctRepositorie from "../../../repositorie/database/PrismaAuctRepositorie";
import PrismaClientRepositorie from "../../../repositorie/database/PrismaClientRepositorie";
const prismaAuct = new PrismaAuctRepositorie()
const prismaClient = new PrismaClientRepositorie()

interface params {
    auct_id: string
    creator_id: string
    client_id:string
    url: string
    nano_id: string
    status: any
}


export const listAuct = (params:params): Promise<AuctResponse> => {

    console.log("listagem... -> ", params)

    return new Promise(async (resolve, reject) => {
        try {

            const currentClient = await prismaClient.find(params.client_id)
            if(!currentClient){
                reject({ status_code: 404, body: "client not founded" })
            }
            const currentAuct = await prismaAuct.list(params)

            if (!currentAuct) {
                reject({ status_code: 404, body: "any auct founded" })
            } else {
                resolve({ status_code: 200, body: currentAuct })
            }

        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }
    })

}