import axios from "axios";
import IBid from "../../../entities/IBid";
import PrismaBidRepositorie from "../../../repositorie/database/PrismaBidRepositorie";
import PrismaProductRepositorie from "../../../repositorie/database/PrismaProductRepositorie";


interface T { }
const prismaBid = new PrismaBidRepositorie()
const prismaProduct = new PrismaProductRepositorie()

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

                    // Enviar websocket para notificar outros robôs
                    try {
                        await axios.post(
                            `${process.env.API_WEBSOCKET_AUK}/main/sent-message?message_type=${dataBid.auct_id}-auto-bid`,
                            { body: newBidData },
                            { timeout: 5000 }
                        );
                    } catch (error: any) {
                        console.log("Erro ao enviar mensagem para WebSocket:", error.message);
                    }

                    // Atualizar o valor do último lance do disputante
                    disputante.value = newBidData.value;
                    return true;
                }

                return false;
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