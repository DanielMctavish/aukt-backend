import { SESClient, SendTemplatedEmailCommand, VerifyEmailAddressCommand } from "@aws-sdk/client-ses";
import { MessengerResponse } from "../IMainMessenger";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SENDER_EMAIL = 'daniel@aukt.com.br';

const SendConfirmationEmail = async (emailTo: string, clientId: string): Promise<MessengerResponse> => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!emailTo || !clientId) {
                return reject({
                    status_code: 400,
                    body: 'Email ou clientId não podem ser vazios'
                })
            }

            const client = await prisma.client.findUnique({
                where: { id: clientId }
            });

            if (!client) {
                return reject({
                    status_code: 404,
                    body: 'Cliente não encontrado'
                })
            }

            if (client?.verifiedEmail) {
                return resolve({
                    status_code: 200,
                    body: 'Email já está verificado'
                });
            }

            const sesClient = new SESClient({
                region: 'sa-east-1',
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
                }
            });

            try {
                // Primeiro envia nosso email personalizado usando o template
                const sendCommand = new SendTemplatedEmailCommand({
                    Source: SENDER_EMAIL,
                    Destination: {
                        ToAddresses: [emailTo],
                    },
                    Template: "AUKVerificationTemplate", // Nome do template que criamos
                    TemplateData: JSON.stringify({
                        name: client.name
                    })
                });

                // Depois envia o email de verificação do SES
                const verifyCommand = new VerifyEmailAddressCommand({
                    EmailAddress: emailTo
                });

                await sesClient.send(sendCommand);
                await sesClient.send(verifyCommand);

                return resolve({
                    status_code: 200,
                    body: 'Emails de boas-vindas e verificação enviados com sucesso'
                });

            } catch (error: any) {
                if (error.message?.includes('Template AUKWelcomeTemplate does not exist')) {
                    return reject({
                        status_code: 404,
                        body: 'Template de email não encontrado. Por favor, crie o template primeiro.'
                    });
                }

                throw error;
            }

        } catch (error: any) {
            console.error('Erro ao verificar email:', error);
            return reject({
                status_code: 500,
                body: error.message || 'Falha ao verificar email'
            });
        }
    });
};

export default SendConfirmationEmail;