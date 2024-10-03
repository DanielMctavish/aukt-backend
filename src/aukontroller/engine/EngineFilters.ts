import { IAuct } from "../../app/entities/IAuct";
import { IProduct } from "../../app/entities/IProduct";
import PrismaAuctRepositorie from "../../app/repositorie/database/PrismaAuctRepositorie";
import { getAukSocket, setAukSocket } from "./EngineSocket";
const prismaAuct = new PrismaAuctRepositorie();

export const EngineFilters = async (
    resolve: any,
    currentAuct: IAuct,
    group: string,
    resume_product_id?: string
): Promise<IProduct | false> => {

    let currentProductIndex: number = getAukSocket().nextProductIndex ?? 0;

    // Filtrando produtos pelo grupo
    if (!currentAuct) return resolve(null);
    const allProducts: IProduct[] | undefined = currentAuct.product_list;
    const filteredProducts: IProduct[] | undefined = allProducts?.filter((product: any) => product.group === group);

    await prismaAuct.update({ status: "live" }, currentAuct.id);

    if (!filteredProducts || filteredProducts.length === 0) {
        console.log("No filtered products found.");
        return resolve(null);
    }

    // Logs para verificar o que está acontecendo
    console.log("01 - Current Product Index: ", currentProductIndex);

    async function findIndexAsync<T>(
        array: T[],
        predicate: (item: T) => Promise<boolean>
    ): Promise<number> {
        for (let i = 0; i < array.length; i++) {
            if (await predicate(array[i])) {
                return i;
            }
        }
        return -1;
    }

    if (resume_product_id) {
        const index = await findIndexAsync(filteredProducts, async (product) => {
            return product.id === resume_product_id;
        }) + 1;

        console.log("02 Observando INDEX -> ", index);

        await setAukSocket({
            nextProductIndex: index
        });
    }

    return filteredProducts[currentProductIndex] !== undefined
        ? filteredProducts[currentProductIndex]
        : false; // Retorna false se o índice não for válido
}
