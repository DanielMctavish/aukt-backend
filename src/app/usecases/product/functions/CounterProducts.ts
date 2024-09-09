import PrismaProductRepositorie from "../../../repositorie/database/PrismaProductRepositorie";
import { ProductResponse } from "../../IMainProduct";

const prismaProduct = new PrismaProductRepositorie();

const counterProducts = async (): Promise<ProductResponse> => {
    return new Promise(async (resolve, reject) => {
        try {
            const countAll = await prismaProduct.countAllProducts();
            resolve({
                status_code: 200,
                body: {
                    countAll: countAll
                }
            });
        } catch (error: any) {
            reject({ status_code: 500, body: error.message });
        }
    });
};

const counterProductsWithBids = async (): Promise<ProductResponse> => {
    return new Promise(async (resolve, reject) => {
        try {
            const countAll = await prismaProduct.countAllWithWinners();
            resolve({
                status_code: 200,
                body: {
                    countAll: countAll
                }
            });
        } catch (error: any) {
            reject({ status_code: 500, body: error.message });
        }
    });
};

export { counterProducts, counterProductsWithBids };