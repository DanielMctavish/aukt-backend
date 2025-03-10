import IBid from "../../../entities/IBid";
import { IProduct } from "../../../entities/IProduct";
import PrismaBidRepositorie from "../../../repositorie/database/PrismaBidRepositorie";
import PrismaProductRepositorie from "../../../repositorie/database/PrismaProductRepositorie";
import axios from "axios";

const prismaBid = new PrismaBidRepositorie();
const prismaProduct = new PrismaProductRepositorie();

interface ProcessAutoBidsResult {
    highestBid: IBid;
    processedClientIds: Set<string>;
}

/**
 * Processa lances automáticos para um produto
 * @param product Produto que recebeu o lance
 * @param currentBid Lance atual que disparou o processamento
 * @param isBidInCataloge Se o lance foi feito em catálogo
 * @param minIncrement Incremento mínimo para lances automáticos
 * @returns Objeto com o lance mais alto e lista de clientes processados
 */
export const processAutoBids = async (
    product: IProduct,
    currentBid: IBid,
    isBidInCataloge: boolean,
    minIncrement: number = 20
): Promise<ProcessAutoBidsResult> => {
    // Inicializa o lance mais alto com o lance atual
    let highestBid = currentBid;

    // Conjunto para rastrear clientes que já deram lances automáticos
    const processedClientIds = new Set<string>();

    // Adiciona o cliente atual para evitar que ele dê lance automático contra si mesmo
    if (currentBid.client_id) {
        processedClientIds.add(currentBid.client_id);
    }

    try {
        // Busca o produto atualizado para ter a lista mais recente de lances
        const updatedProduct = await prismaProduct.find({ product_id: product.id });
        if (!updatedProduct || !updatedProduct.Bid || updatedProduct.Bid.length === 0) {
            return { highestBid, processedClientIds };
        }

        // Filtra apenas lances com cover_auto=true e que não sejam do cliente atual
        const autoBids: IBid[] = updatedProduct.Bid.filter((bid: IBid) =>
            bid.cover_auto === true &&
            bid.client_id !== currentBid.client_id &&
            !processedClientIds.has(bid.client_id)
        );

        console.log(`Encontrados ${autoBids.length} lances automáticos para processar`);

        // Processa cada lance automático
        for (const autoBid of autoBids) {
            // Verifica se o cliente já foi processado neste ciclo
            if (processedClientIds.has(autoBid.client_id)) {
                continue;
            }

            // Calcula o valor do novo lance automático (incremento mínimo ou 2% acima do lance atual)
            const incrementValue = Math.max(minIncrement, highestBid.value * 0.02);
            const newBidValue = Math.ceil(highestBid.value + incrementValue);

            // Verifica se o lance automático já atingiu ou excederia o limite
            if (autoBid.cover_auto_limit) {
                // Se o valor atual já atingiu o limite
                if (autoBid.value >= autoBid.cover_auto_limit) {
                    console.log(`Lance automático já atingiu o limite: ${autoBid.cover_auto_limit} para cliente ${autoBid.client_id}`);
                    
                    // Desativa o lance automático
                    await prismaBid.UpdateBid(autoBid.id, {
                        cover_auto: false
                    });
                    
                    // Adiciona o cliente à lista de processados
                    processedClientIds.add(autoBid.client_id);
                    continue;
                }
                
                // Se o novo valor excederia o limite
                if (newBidValue > autoBid.cover_auto_limit) {
                    console.log(`Lance automático excederia o limite: ${autoBid.cover_auto_limit} para cliente ${autoBid.client_id}`);
                    
                    // Usa o valor limite como último lance automático
                    if (autoBid.cover_auto_limit > highestBid.value) {
                        const limitBidData: IBid = {
                            ...autoBid,
                            value: autoBid.cover_auto_limit,
                            product_id: product.id,
                            created_at: new Date(),
                            updated_at: new Date()
                        };
                        
                        // Registra o cliente como processado
                        processedClientIds.add(autoBid.client_id);
                        
                        // Salva o lance no banco de dados
                        const limitBid = await prismaBid.CreateBid(limitBidData);
                        
                        // Atualiza o real_value do produto
                        await prismaProduct.update(
                            { real_value: autoBid.cover_auto_limit },
                            product.id
                        );
                        
                        // Atualiza o lance mais alto
                        if (limitBid.value > highestBid.value) {
                            highestBid = limitBid;
                        }
                        
                        // Envia o lance para o WebSocket
                        const websocketEndpoint = isBidInCataloge
                            ? `${product.auct_id}-bid-cataloged`
                            : `${product.auct_id}-bid`;
                        
                        await axios.post(
                            `${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${websocketEndpoint}`,
                            { body: limitBid }
                        ).catch(error => {
                            console.error("Erro ao enviar lance automático para WebSocket:", error);
                        });
                    }
                    
                    // Desativa o lance automático após usar o limite
                    await prismaBid.UpdateBid(autoBid.id, {
                        cover_auto: false
                    });
                    
                    continue;
                }
            }

            console.log(`Processando lance automático: Cliente ${autoBid.client_id}, Valor ${newBidValue}`);

            // Cria o novo lance automático
            const newAutoBidData: IBid = {
                ...autoBid,
                value: newBidValue,
                product_id: product.id,
                created_at: new Date(),
                updated_at: new Date()
            };

            // Registra o cliente como processado
            processedClientIds.add(autoBid.client_id);

            // Salva o lance no banco de dados
            const newAutoBid = await prismaBid.CreateBid(newAutoBidData);

            // Atualiza o real_value do produto
            await prismaProduct.update(
                { real_value: newBidValue },
                product.id
            );

            // Atualiza o lance mais alto se necessário
            if (newAutoBid.value > highestBid.value) {
                highestBid = newAutoBid;
            }

            // Envia o lance para o WebSocket
            const websocketEndpoint = isBidInCataloge
                ? `${product.auct_id}-bid-cataloged`
                : `${product.auct_id}-bid`;

            await axios.post(
                `${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${websocketEndpoint}`,
                { body: newAutoBid }
            ).catch(error => {
                console.error("Erro ao enviar lance automático para WebSocket:", error);
            });
        }

        return { highestBid, processedClientIds };
    } catch (error) {
        console.error("Erro ao processar lances automáticos:", error);
        return { highestBid, processedClientIds };
    }
}; 