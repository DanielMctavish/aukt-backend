import { IClient } from "../../../entities/IClient";
import { ClientResponse } from "../../IMainClient";
import PrismaClientRepositorie from "../../../repositorie/database/PrismaClientRepositorie";
const prismaClient = new PrismaClientRepositorie()

export const createClient = (data: IClient): Promise<ClientResponse> => {

    return new Promise(async (resolve, reject) => {

        try {

            const currentClient = await prismaClient.create(data)
            resolve({ status_code: 201, body: currentClient })
            
        } catch (error: any) {
            reject({ status_code: 500, body: error.message })
        }

    })

}