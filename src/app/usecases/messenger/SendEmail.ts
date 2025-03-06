import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { ICartela } from "../../entities/ICartela";
import { MessengerResponse } from "../IMainMessenger";

// vamos pegar a lista de produtos da cartela e enviar um email para o cliente com os valores e formas de pagamento

const SENDER_EMAIL = 'daniel@aukt.com.br';

// Função auxiliar para formatar o endereço
const formatAddress = (address: any): string => {
    try {
        const addressObj = typeof address === 'string' ? JSON.parse(address) : address;
        return `${addressObj.street}, ${addressObj.number}
${addressObj.city} - ${addressObj.state}
CEP: ${addressObj.cep}`.trim();
    } catch (e) {
        return address || 'Endereço não informado';
    }
}

const sendEmail = async (cartela: ICartela, emailTo: string): Promise<MessengerResponse> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sesClient = new SESClient({
                region: 'sa-east-1',
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
                }
            });

            let htmlTemplate = `
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Confirmação de Cartela - Aukt Leilões</title>
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 10px;">
                        <div style="background-color: #143d64; color: white; padding: 15px; text-align: center; border-radius: 5px 5px 0 0;">
                            <h1 style="margin: 0; font-size: 24px;">Confirmação de Cartela</h1>
                            <p style="margin: 10px 0 0 0;">Cartela ${cartela.id} - ${cartela.Client.name}</p>
                        </div>

                        <div style="padding: 15px; background-color: #f9f9f9; border: 1px solid #ddd;">
                            <p style="margin-top: 0;">Prezado(a) ${cartela.Client.name},</p>
                            <p>Agradecemos sua participação em nosso leilão Nº ${cartela.Auct.nano_id}.</p>

                            <div style="background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #143d64;">
                                <h3 style="color: #143d64; margin-top: 0;">Informações de Pagamento</h3>
                                <p style="margin-bottom: 5px;">Solicitamos que o pagamento seja realizado em até 5 dias úteis.</p>
                                <h4 style="color: #143d64; margin: 15px 0 5px 0;">Dados do Anunciante:</h4>
                                <p style="margin: 0;">
                                    ${cartela.Advertiser.company_name}<br>
                                    ${cartela.Advertiser.CNPJ ? `CNPJ: ${cartela.Advertiser.CNPJ}<br>` : ''}
                                    ${formatAddress(cartela.Advertiser.company_adress)}
                                </p>
                            </div>

                            <div style="background-color: #143d64; color: white; padding: 15px; margin: 15px 0; border-radius: 5px;">
                                <h3 style="margin-top: 0;">Resumo do Pagamento</h3>
                                <p style="margin: 0;">
                                    Total das compras: R$ ${cartela.amount.toFixed(2)}<br>
                                    Status do Pagamento: ${cartela.status}<br>
                                    ${cartela.transaction_id ? `ID da Transação: ${cartela.transaction_id}` : 'Aguardando Pagamento'}
                                </p>
                            </div>

                            <div style="background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #143d64;">
                                <h3 style="color: #143d64; margin-top: 0;">Itens Arrematados</h3>
                                ${cartela.products.map(product => `
                                    <div style="border: 1px solid #eee; padding: 10px; margin: 10px 0; border-radius: 5px;">
                                        <div style="display: flex; flex-direction: column; gap: 10px;">
                                            ${product.cover_img_url ? `
                                                <img src="${product.cover_img_url}" 
                                                    alt="${product.title}" 
                                                    style="width: 100%; max-width: 200px; height: auto; border-radius: 5px; object-fit: cover; margin: 0 auto;"
                                                />
                                            ` : ''}
                                            <div style="flex: 1;">
                                                <p style="margin: 0 0 5px 0;">
                                                    <strong style="color: #143d64; font-size: 16px;">Lote: ${product.lote}</strong><br>
                                                    <strong>${product.title}</strong>
                                                </p>
                                                <p style="margin: 5px 0; font-size: 14px;">${product.description}</p>
                                                <p style="margin: 5px 0;"><strong style="color: #143d64;">Valor: R$ ${product.real_value.toFixed(2)}</strong></p>
                                                ${product.group ? `<p style="margin: 5px 0; color: #666; font-size: 14px;">Grupo: ${product.group}</p>` : ''}
                                                <p style="margin: 5px 0; color: #666; font-size: 13px;">
                                                    Dimensões: ${product.width}x${product.height}cm | 
                                                    Peso: ${product.weight}kg
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>

                            ${cartela.tracking_code ? `
                                <div style="background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #143d64;">
                                    <h4 style="margin-top: 0;">Código de Rastreio:</h4>
                                    <p style="margin: 0;">${cartela.tracking_code}</p>
                                </div>
                            ` : ''}

                            <div style="text-align: center; padding: 15px; color: #666; font-size: 12px; margin-top: 20px;">
                                <p style="margin: 5px 0;">Data de Criação: ${new Date(cartela.created_at).toLocaleDateString('pt-BR')}</p>
                                <p style="margin: 5px 0;">Em caso de dúvidas, entre em contato com o anunciante:</p>
                                <p style="margin: 5px 0;">Email: ${cartela.Advertiser.email}</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `;

            const command = new SendEmailCommand({
                Source: SENDER_EMAIL,
                Destination: {
                    ToAddresses: [emailTo],
                },
                ReplyToAddresses: [cartela.Advertiser.email],
                Message: {
                    Subject: {
                        Data: `Confirmação de Cartela - Leilão ${cartela.Auct.title}`,
                        Charset: 'UTF-8',
                    },
                    Body: {
                        Html: {
                            Data: htmlTemplate,
                            Charset: 'UTF-8',
                        },
                    },
                },
            });

            await sesClient.send(command);
            return resolve({ 
                status_code: 200, 
                body: 'Email enviado com sucesso' 
            });

        } catch (error: any) {
            console.error('Erro ao enviar email:', error);
            return reject({ 
                status_code: 500, 
                body: error.message || 'Falha ao enviar email'
            });
        }
    });
};

export { sendEmail };