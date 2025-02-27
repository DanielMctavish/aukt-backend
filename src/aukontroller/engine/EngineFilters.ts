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
    
    // Filtra produtos pelo grupo E que não têm vencedor
    const filteredProducts: IProduct[] | undefined = allProducts?.filter((product: any) => 
        product.group === group && !product.winner_id && !product.Winner
    );

    await prismaAuct.update({ status: "live" }, currentAuct.id);

    if (!filteredProducts || filteredProducts.length === 0) {
        return resolve(null);
    }

    // Logs para verificar o que está acontecendo

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

        await setAukSocket({
            nextProductIndex: index
        });
    }

    // Verifica se o produto atual tem vencedor
    if (filteredProducts[currentProductIndex]?.winner_id || 
        filteredProducts[currentProductIndex]?.Winner) {
        // Se tiver vencedor, incrementa o índice para pegar o próximo produto
        currentProductIndex++;
        await setAukSocket({
            nextProductIndex: currentProductIndex
        });
    }

    return filteredProducts[currentProductIndex] !== undefined
        ? filteredProducts[currentProductIndex]
        : false; // Retorna false se o índice não for válido
}
