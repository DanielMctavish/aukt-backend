import { ClientResponse } from "../../IMainClient";
import PrismaBidRepositorie from "../../../repositorie/database/PrismaBidRepositorie";
import IBid from "../../../entities/IBid";

const prismaBid = new PrismaBidRepositorie();

export const updateBid = async (id: string, data: Partial<IBid>): Promise<ClientResponse> => {
    try {
        const updatedBid = await prismaBid.UpdateBid(id, data);
        return { status_code: 200, body: updatedBid };
    } catch (error: any) {
        return { status_code: 500, body: error.message };
    }
};