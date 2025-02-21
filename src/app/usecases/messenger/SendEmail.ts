import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { ICartela } from "../../entities/ICartela";
import * as fs from 'fs';
import * as path from 'path';
import { MessengerResponse } from "../IMainMessenger";

// vamos pegar a lista de produtos da cartela e enviar um email para o cliente com os valores e formas de pagamento

const SENDER_EMAIL = 'daniel@aukt.com.br';

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

            // Usando template string diretamente no código
            let htmlTemplate = `
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Confirmação de Cartela - Aukt Leilões</title>
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
                    <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
                        <div style="background-color: #143d64; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
                            <h1>Confirmação de Cartela</h1>
                            <p>Cartela ${cartela.id} - ${cartela.Client.name}</p>
                        </div>

                        <div style="padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd;">
                            <p>Prezado(a) ${cartela.Client.name},</p>
                            <p>Agradecemos sua participação em nosso leilão Nº ${cartela.Auct.nano_id}.</p>

                            <div style="background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #143d64;">
                                <h3 style="color: #143d64;">Informações de Pagamento</h3>
                                <p>Solicitamos que o pagamento seja realizado em até 5 dias úteis.</p>
                                <h4 style="color: #143d64;">Dados do Anunciante:</h4>
                                <p>${cartela.Advertiser.company_name}<br>
                                CNPJ: ${cartela.Advertiser.CNPJ || 'Não informado'}<br>
                                ${cartela.Advertiser.company_adress}</p>
                            </div>

                            <div style="background-color: #143d64; color: white; padding: 15px; margin: 20px 0; border-radius: 5px;">
                                <h3>Resumo do Pagamento</h3>
                                <p>Total das compras: R$ ${cartela.amount.toFixed(2)}<br>
                                Status do Pagamento: ${cartela.status}<br>
                                ${cartela.transaction_id ? `ID da Transação: ${cartela.transaction_id}` : 'Aguardando Pagamento'}</p>
                            </div>

                            <div style="background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #143d64;">
                                <h3 style="color: #143d64;">Itens Arrematados</h3>
                                ${cartela.products.map(product => `
                                    <div style="border: 1px solid #eee; padding: 15px; margin: 10px 0; border-radius: 5px; display: flex; gap: 20px;">
                                        <div style="min-width: 150px; max-width: 150px;">
                                            ${product.cover_img_url ? `
                                                <img src="${product.cover_img_url}" 
                                                    alt="${product.title}" 
                                                    style="width: 100%; height: auto; border-radius: 5px; object-fit: cover;"
                                                />
                                            ` : ''}
                                        </div>
                                        <div>
                                            <p>
                                                <strong style="color: #143d64; font-size: 16px;">Lote: ${product.lote}</strong><br>
                                                <strong>${product.title}</strong><br>
                                                ${product.description}<br>
                                                <strong style="color: #143d64;">Valor: R$ ${product.real_value.toFixed(2)}</strong><br>
                                                ${product.group ? `<span style="color: #666;">Grupo: ${product.group}</span><br>` : ''}
                                                <span style="color: #666;">
                                                    Dimensões: ${product.width}x${product.height}cm | 
                                                    Peso: ${product.weight}kg
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>

                            ${cartela.tracking_code ? `
                                <div style="background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #143d64;">
                                    <h4>Código de Rastreio:</h4>
                                    <p>${cartela.tracking_code}</p>
                                </div>
                            ` : ''}

                            <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
                                <p>Data de Criação: ${new Date(cartela.created_at).toLocaleDateString('pt-BR')}</p>
                                <p>Em caso de dúvidas, entre em contato com o anunciante:</p>
                                <p>Email: ${cartela.Advertiser.email}</p>
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