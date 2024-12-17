import IParams from "../../../entities/IParams"
import PrismaProductRepositorie from "../../../repositorie/database/PrismaProductRepositorie"
import { ProductResponse } from "../../IMainProduct"

const prismaProducts = new PrismaProductRepositorie()

// Definir as chaves válidas de IParams
type ParamsKey = keyof IParams;

export const ListProductsByFilters = (params: Partial<IParams>): Promise<ProductResponse> => {
    return new Promise(async (resolve, reject) => {
        try {
            // Converter valores para número antes da validação
            const minValue = params.min_initial_value ? Number(params.min_initial_value) : undefined;
            const maxValue = params.max_initial_value ? Number(params.max_initial_value) : undefined;

            // Validações
            if (minValue !== undefined && maxValue !== undefined) {
                if (isNaN(minValue) || isNaN(maxValue)) {
                    throw new Error("Valores mínimo e máximo devem ser números válidos");
                }
                if (minValue > maxValue) {
                    throw new Error("Valor mínimo não pode ser maior que o valor máximo");
                }
                // Atualizar os params com os valores convertidos
                params.min_initial_value = minValue;
                params.max_initial_value = maxValue;
            }

            if (params.min_width && params.max_width) {
                if (params.min_width > params.max_width) {
                    throw new Error("Largura mínima não pode ser maior que a largura máxima");
                }
            }

            if (params.created_after && params.created_before) {
                const afterDate = new Date(params.created_after);
                const beforeDate = new Date(params.created_before);
                if (afterDate > beforeDate) {
                    throw new Error("Data inicial não pode ser posterior à data final");
                }
            }
            
            // Validar ordem
            if (params.initial_value_order && 
                !['asc', 'desc'].includes(params.initial_value_order.toLowerCase())) {
                throw new Error("Ordem de valor inicial deve ser 'asc' ou 'desc'");
            }

            // Converter para lowercase se existir
            if (params.initial_value_order) {
                params.initial_value_order = params.initial_value_order.toLowerCase() as 'asc' | 'desc';
            }

            const currentProduct = await prismaProducts.list(params)
            resolve({
                status_code: 200,
                body: {
                    products: currentProduct,
                    total: currentProduct.length,
                    filters_applied: (Object.keys(params) as ParamsKey[])
                        .filter((key) => params[key] !== undefined),
                    ordering: params.initial_value_order ? 
                        `Ordenado por valor inicial: ${params.initial_value_order}` : 
                        'Ordenação padrão'
                }
            })

        } catch (error: any) {
            reject({
                status_code: error.status_code || 500,
                body: error.message || "Erro ao listar produtos"
            })
        }
    })
}