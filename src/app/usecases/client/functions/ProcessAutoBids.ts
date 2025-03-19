import axios from "axios";
import IBid from "../../../entities/IBid";
import PrismaBidRepositorie from "../../../repositorie/database/PrismaBidRepositorie";
import PrismaProductRepositorie from "../../../repositorie/database/PrismaProductRepositorie";
import PrismaClientRepositorie from "../../../repositorie/database/PrismaClientRepositorie";


interface T { }
const prismaBid = new PrismaBidRepositorie()
const prismaProduct = new PrismaProductRepositorie()
const prismaClient = new PrismaClientRepositorie()

function ProcessAutoBids(dataBid: IBid, product_id: string): Promise<T> {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("PA1. iniciando o processo de lances automáticos")
            
            // Função auxiliar para processar um lance
            async function processarLance(disputante: Partial<IBid>, valorAtual: number, ultimoLanceClientId: string | null): Promise<boolean> {
                console.log(`Processando lance para ${disputante.client_id} - Valor atual: ${valorAtual} - Limite: ${disputante.cover_auto_limit}`)
                
                // Se ultrapassou o limite, não dá mais lances
                if (disputante.cover_auto_limit && valorAtual >= disputante.cover_auto_limit) {
                    console.log(`Disputante ${disputante.client_id} atingiu seu limite de ${disputante.cover_auto_limit}`)
                    return false;
                }

                // Se o disputante já é o dono do maior lance atual, não deve dar outro lance
                if (disputante.client_id === ultimoLanceClientId) {
                    console.log(`Disputante ${disputante.client_id} já tem o maior lance atual, ignorando auto-lance`);
                    return false;
                }

                // Se pode dar lance
                if (disputante.value && valorAtual > disputante.value) {
                    const newBidData: Partial<IBid> = {
                        client_id: disputante.client_id,
                        product_id: product_id,
                        value: valorAtual + 20,
                        cover_auto: disputante.cover_auto,
                        cover_auto_limit: disputante.cover_auto_limit,
                        created_at: new Date(),
                        updated_at: new Date(),
                        auct_id: dataBid.auct_id
                    };

                    // Criar o lance
                    const newBid = await prismaBid.CreateBid(newBidData as IBid);
                    console.log(`Novo lance criado por ${disputante.client_id}: ${newBidData.value}`)

                    // Atualizar o real_value do produto para garantir que o frontend seja atualizado corretamente
                    try {
                        await prismaProduct.update(
                            { real_value: newBidData.value },
                            product_id
                        );
                        console.log(`Real_value do produto atualizado para ${newBidData.value}`);
                    } catch (error) {
                        console.log("Erro ao atualizar real_value do produto:", error);
                    }

                    // Buscar informações completas do lance para enviar ao WebSocket
                    let bidToSend = newBid;
                    
                    // Adicionar o Client ao objeto de lance, se disponível
                    if (disputante.Client) {
                        bidToSend = {
                            ...bidToSend,
                            Client: disputante.Client
                        };
                    } else if (disputante.client_id) {
                        // Buscar dados do cliente se não estiverem disponíveis
                        try {
                            const clientData = await prismaClient.find(disputante.client_id);
                            if (clientData) {
                                bidToSend = {
                                    ...bidToSend,
                                    Client: clientData
                                };
                            }
                        } catch (error) {
                            console.log(`Erro ao buscar cliente ${disputante.client_id}:`, error);
                        }
                    }
                    
                    // Adicionar o Product ao objeto de lance, se necessário
                    if (!bidToSend.Product) {
                        try {
                            const product = await prismaProduct.find({ product_id });
                            if (product) {
                                bidToSend = {
                                    ...bidToSend,
                                    Product: [product]
                                };
                            }
                        } catch (error) {
                            console.log("Erro ao buscar detalhes do produto:", error);
                        }
                    }

                    // Enviar websocket para notificar outros robôs
                    try {
                        // Usar o mesmo canal dos lances manuais para garantir que o frontend receba as atualizações
                        // Se o leilão é catalogado, usamos bid-cataloged, caso contrário, bid
                        const websocketEndpoint = isCatalogued(dataBid) 
                            ? `${dataBid.auct_id}-bid-cataloged`
                            : `${dataBid.auct_id}-bid`;

                        console.log(`Enviando lance automático para websocket endpoint: ${websocketEndpoint}`);
                        
                        // Atualizar o produto com o novo valor antes de enviá-lo
                        const updatedProduct = await prismaProduct.find({ product_id });
                        
                        // Importante: Verificar se temos o produto atualizado
                        if (updatedProduct) {
                            console.log(`Produto atualizado com real_value: ${updatedProduct.real_value}`);
                        }

                        // Criar estrutura exatamente igual ao que o frontend espera receber
                        // para garantir a compatibilidade com os handlers existentes
                        const messageBody = {
                            body: {
                                id: bidToSend.id,
                                client_id: disputante.client_id,
                                product_id: product_id,
                                auct_id: dataBid.auct_id,
                                value: newBidData.value,
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString(),
                                cover_auto: true,
                                Client: bidToSend.Client || null,
                                // Incluir o campo Product para o frontend verificar
                                Product: updatedProduct ? [updatedProduct] : undefined
                            }
                        };
                        
                        // Log detalhado para depuração
                        console.log(`Enviando lance com value=${newBidData.value} para produto=${product_id}`);
                        
                        await axios.post(
                            `${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${websocketEndpoint}`,
                            messageBody,
                            {
                                timeout: 5000,
                                headers: {
                                    'Content-Type': 'application/json',
                                }
                            }
                        );
                        console.log(`Lance automático de ${disputante.client_id}: ${newBidData.value} enviado ao websocket com sucesso`);
                    } catch (error: any) {
                        console.log("Erro ao enviar mensagem para WebSocket:", error.message);
                    }

                    // Atualizar o valor do último lance do disputante
                    disputante.value = newBidData.value;
                    return true;
                }

                return false;
            }

            // Função auxiliar para verificar se o leilão é catalogado
            function isCatalogued(bid: IBid): boolean {
                // No BidAuct, temos uma variável bidInCataloge, que é usada para determinar o endpoint
                // A estratégia mais confiável é verificar o status do leilão no contexto atual
                try {
                    // Se o leilão tem status 'cataloged', está em catálogo
                    if (bid.Auct && bid.Auct.status === 'cataloged') {
                        return true;
                    }
                    
                    // Verifica se o produto pertence a leilão com status cataloged
                    if (bid.Product && bid.Product.length > 0 && 
                        bid.Product[0].Auct && bid.Product[0].Auct.status === 'cataloged') {
                        return true;
                    }
                    
                    // Em último caso, verificamos se o websocketEndpoint já foi determinado em BidAuct
                    // Se o lance original foi enviado como cataloged, os lances automáticos também devem ser
                    return false;
                } catch (error) {
                    console.error("Erro ao determinar se o leilão é catalogado:", error);
                    return false; // Em caso de erro, assumimos que não é catalogado
                }
            }

            let continuarDisputando = true;
            let rodada = 1;

            while (continuarDisputando) {
                console.log(`\nIniciando rodada ${rodada} de lances automáticos`)
                
                // Buscar produto atualizado para ter os lances mais recentes
                const currentProduct = await prismaProduct.find({ product_id })
                const allBids = currentProduct?.Bid;
                
                if (!allBids) break;

                // Organizar disputantes ativos (que ainda não atingiram seus limites)
                let disputantes: Partial<IBid>[] = [];
                
                // Encontrar o maior lance atual e seu proprietário
                let maiorLance = Math.max(...allBids.map((bid: IBid) => bid.value));
                const clienteComMaiorLance = allBids.find((b: IBid) => b.value === maiorLance)?.client_id || null;
                console.log(`Maior lance atual (${maiorLance}) é do cliente: ${clienteComMaiorLance}`);
                
                // Na primeira rodada, verificamos se o maior lance é do cliente que acabou de dar lance
                if (rodada === 1 && clienteComMaiorLance === dataBid.client_id) {
                    console.log(`Cliente ${dataBid.client_id} acabou de dar o maior lance. Pulando primeira rodada de lances automáticos.`);
                    // Verificamos se existe algum outro disputante para continuar
                    const temOutrosDisputantes = allBids.some((bid: IBid) => 
                        bid.cover_auto_limit && 
                        bid.cover_auto_limit > 0 && 
                        bid.client_id !== dataBid.client_id
                    );
                    
                    if (!temOutrosDisputantes) {
                        console.log("Não há outros disputantes automáticos. Finalizando processo.");
                        break;
                    }
                }
                
                allBids.forEach((bid: IBid) => {
                    if (bid.cover_auto_limit && bid.cover_auto_limit > 0) {
                        // Verificar se este cliente já existe na lista de disputantes
                        const disputanteExistente = disputantes.find(d => d.client_id === bid.client_id);
                        
                        if (!disputanteExistente) {
                            // Na primeira rodada, não incluir o cliente que acabou de dar o lance manual
                            if (rodada > 1 || bid.client_id !== dataBid.client_id) {
                                disputantes.push(bid);
                            } else {
                                console.log(`Cliente ${bid.client_id} ignorado como disputante na primeira rodada para evitar auto-competição`);
                            }
                        }
                    }
                });

                console.log(`Maior lance atual no início da rodada: ${maiorLance}`);
                
                // Log de disputantes ativos
                const disputantesInfo = disputantes.map(d => ({
                    client_id: d.client_id,
                    valor_atual: d.value,
                    limite: d.cover_auto_limit
                }));
                console.log(`Disputantes ativos nesta rodada: ${JSON.stringify(disputantesInfo)}`);

                // Processar lances desta rodada em sequência
                let algumLanceDado = false;
                for (const disputante of disputantes) {
                    const deuLance = await processarLance(
                        disputante, 
                        maiorLance, 
                        allBids.find((b: IBid) => b.value === maiorLance)?.client_id || null
                    );
                    if (deuLance) {
                        // Atualizar o maior lance para o próximo disputante
                        maiorLance = disputante.value!; // Sabemos que value existe pois deuLance é true
                        algumLanceDado = true;
                    }
                }
                
                // Se nenhum robô deu lance nesta rodada, terminamos
                continuarDisputando = algumLanceDado;
                
                if (!continuarDisputando) {
                    console.log("Nenhum robô deu lance nesta rodada, finalizando disputa");
                }

                rodada++;
                
                // Aguardar um pequeno intervalo entre as rodadas
                await new Promise(r => setTimeout(r, 1000));
            }

            resolve({});

        } catch (error) {
            console.log("PA-ERROR:", error)
            reject(error);
        }
    });
}

export default ProcessAutoBids;