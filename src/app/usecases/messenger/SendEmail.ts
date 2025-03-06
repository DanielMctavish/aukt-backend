import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { MessengerResponse } from "../IMainMessenger";
import { DataSendEmailCartela } from "./MainMessenger";
import PrismaCartelaRepositorie from "../../../app/repositorie/database/PrismaCartelaRepositorie";
import PrismaClientRepositorie from "../../../app/repositorie/database/PrismaClientRepositorie";
import axios from 'axios';

// Vamos pegar a lista de produtos da cartela e enviar um email para o cliente com os valores e formas de pagamento
const SENDER_EMAIL = 'daniel@aukt.com.br';
const prismaCartela = new PrismaCartelaRepositorie();
const prismaClient = new PrismaClientRepositorie();

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
};

// Função auxiliar para limpar e codificar URL da imagem
const cleanImageUrl = (url: string): string => {
    if (!url) return ''; // Retorna vazio se não houver URL

    // Remove parâmetros indesejados (como os do Gmail ou outros)
    let cleanUrl = url.split('=s0-d-e1-ft#')[1] || url;

    // Garante que a URL tenha protocolo HTTPS
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = `https://${cleanUrl}`;
    }

    // Codifica a URL para substituir espaços e caracteres especiais
    cleanUrl = encodeURI(cleanUrl);

    // Se for uma URL do Google Storage ou AWS S3, garante que seja HTTPS
    if (cleanUrl.includes('storage.googleapis.com') || cleanUrl.includes('s3.amazonaws.com')) {
        return cleanUrl.replace(/^http:\/\//, 'https://'); // Força HTTPS
    }

    return cleanUrl;
};

const sendEmail = async (data: DataSendEmailCartela): Promise<MessengerResponse> => {
    const cartela = await prismaCartela.find(data.cartelaId);
    const currentClient = await prismaClient.findByEmail(data.emailTo);

    return new Promise(async (resolve, reject) => {
        try {
            if (!currentClient) {
                return reject({
                    status_code: 404,
                    body: 'Cliente não encontrado'
                });
            }

            if (!cartela) {
                return reject({
                    status_code: 404,
                    body: 'Cartela não encontrada'
                });
            }

            const sesClient = new SESClient({
                region: 'sa-east-1',
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
                }
            });

           
            cartela.products.forEach(product => {
                console.log(`URL da imagem do produto ${product.title}:`, cleanImageUrl(product.cover_img_url));
            });

            let htmlTemplate = `
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Confirmação de Cartela - Aukt Leilões</title>
                    <style>
                        @media screen and (max-width: 600px) {
                            .product-container {
                                flex-direction: column !important;
                            }
                            .product-image {
                                width: 100% !important;
                                margin-bottom: 15px !important;
                            }
                            .product-info {
                                width: 100% !important;
                            }
                        }
                    </style>
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
                    <div style="max-width: 800px; margin: 0 auto; padding: 10px;">
                        <div style="background-color: #143d64; color: white; padding: 15px; text-align: center; border-radius: 5px 5px 0 0;">
                            <h1 style="margin: 0; font-size: 24px;">Confirmação de Cartela</h1>
                            <p style="margin: 10px 0 0 0;">Cartela ${cartela.id} - ${currentClient.name}</p>
                        </div>

                        <div style="padding: 15px; background-color: #f9f9f9; border: 1px solid #ddd;">
                            <p style="margin-top: 0;">Prezado(a) ${currentClient.name},</p>
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
                                    <div style="border: 1px solid #eee; padding: 15px; margin: 10px 0; border-radius: 5px;">
                                        <div style="display: flex; flex-direction: column;">
                                            <!-- Imagem do Produto -->
                                            <div style="width: 100%; max-width: 300px; margin: 0 auto 15px auto;">
                                                ${product.cover_img_url ? `
                                                    <img src="${cleanImageUrl(product.cover_img_url)}" 
                                                         alt="${product.title}" 
                                                         style="width: 100%; height: 300px; border-radius: 5px; object-fit: cover;"
                                                    />
                                                ` : `
                                                    <div style="width: 100%; height: 300px; display: flex; align-items: center; justify-content: center; background-color: #f5f5f5; border-radius: 5px; color: #666;">
                                                        <span>Imagem não disponível</span>
                                                    </div>
                                                `}
                                            </div>
                                            
                                            <!-- Informações do Produto -->
                                            <div style="width: 100%;">
                                                <div style="border-top: 1px solid #eee; padding-top: 15px;">
                                                    <p style="margin: 0 0 5px 0;">
                                                        <strong style="color: #143d64; font-size: 18px;">Lote: ${product.lote}</strong><br>
                                                        <strong style="font-size: 16px;">${product.title}</strong>
                                                    </p>
                                                    <p style="margin: 10px 0; font-size: 14px; color: #666;">
                                                        ${product.description}
                                                    </p>
                                                    <p style="margin: 15px 0; font-size: 16px;">
                                                        <strong style="color: #143d64;">Valor: R$ ${product.real_value.toFixed(2)}</strong>
                                                    </p>
                                                    ${product.group ? `
                                                        <p style="margin: 5px 0; color: #666; font-size: 14px;">
                                                            Grupo: ${product.group}
                                                        </p>
                                                    ` : ''}
                                                    <p style="margin: 5px 0; color: #666; font-size: 13px;">
                                                        Dimensões: ${product.width}x${product.height}cm | 
                                                        Peso: ${product.weight}kg
                                                    </p>
                                                </div>
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

                            <footer style="background-color: #143d64; color: white; padding: 20px; margin-top: 30px; border-radius: 5px;">
                                <div style="text-align: center;">
                                    ${cartela.Advertiser.url_profile_company_logo_cover ? `
                                        <img src="${cleanImageUrl(cartela.Advertiser.url_profile_company_logo_cover)}" 
                                             alt="${cartela.Advertiser.company_name}" 
                                             style="max-width: 150px; height: 100px; margin-bottom: 15px; object-fit: contain;"
                                        />
                                    ` : ''}
                                    <h3 style="margin: 0 0 10px 0;">${cartela.Advertiser.company_name}</h3>
                                    <p style="margin: 5px 0;">
                                        ${cartela.Advertiser.CNPJ ? `CNPJ: ${cartela.Advertiser.CNPJ}<br>` : ''}
                                        ${formatAddress(cartela.Advertiser.company_adress)}
                                    </p>
                                    <p style="margin: 10px 0;">
                                        <strong>Contato:</strong><br>
                                        Email: ${cartela.Advertiser.email}
                                    </p>
                                </div>
                            </footer>
                        </div>
                    </div>
                </body>
                </html>
            `;

            const command = new SendEmailCommand({
                Source: SENDER_EMAIL,
                Destination: {
                    ToAddresses: [data.emailTo],
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