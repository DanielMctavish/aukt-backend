import { SESClient, CreateTemplateCommand, UpdateTemplateCommand, GetTemplateCommand } from "@aws-sdk/client-ses";
import { MessengerResponse } from "../IMainMessenger";

interface EmailTemplateData {
    templateName: string;
    subjectPart: string;
    htmlPart: string;
    textPart: string;
}

const sesClient = new SESClient({
    region: 'sa-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
});

const CreateEmailTemplate = async (data: EmailTemplateData): Promise<MessengerResponse> => {
    try {
        // Tenta criar o template primeiro
        try {
            const createCommand = new CreateTemplateCommand({
                Template: {
                    TemplateName: data.templateName,
                    SubjectPart: data.subjectPart,
                    HtmlPart: data.htmlPart,
                    TextPart: data.textPart
                }
            });

            await sesClient.send(createCommand);
            return {
                status_code: 201,
                body: `Template ${data.templateName} criado com sucesso`
            };

        } catch (error: any) {
            // Se o template já existe, tenta atualizá-lo
            if (error.name === 'AlreadyExistsException') {
                const updateCommand = new UpdateTemplateCommand({
                    Template: {
                        TemplateName: data.templateName,
                        SubjectPart: data.subjectPart,
                        HtmlPart: data.htmlPart,
                        TextPart: data.textPart
                    }
                });

                await sesClient.send(updateCommand);
                return {
                    status_code: 200,
                    body: `Template ${data.templateName} atualizado com sucesso`
                };
            }

            throw error;
        }

    } catch (error: any) {
        console.error("Erro ao criar/atualizar template:", error);
        return {
            status_code: 500,
            body: error.message || "Falha ao criar/atualizar template"
        };
    }
};

// Templates predefinidos
export const WelcomeTemplate = {
    templateName: "AUKWelcomeTemplate",
    subjectPart: "Bem-vindo à AUK Leilões - {{name}}!",
    htmlPart: `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Bem-vindo à AUK Leilões</title>
        </head>
        <body>
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #143d64; color: white; padding: 20px; text-align: center;">
                    <h1>Bem-vindo à AUK Leilões!</h1>
                </div>
                <div style="padding: 20px;">
                    <p>Olá {{name}},</p>
                    <p>Estamos muito felizes em ter você conosco! 🎉</p>
                    <!-- Resto do template... -->
                </div>
            </div>
        </body>
        </html>
    `,
    textPart: "Olá {{name}}, Bem-vindo à AUK Leilões!"
};

export const VerificationTemplate = {
    templateName: "AUKVerificationTemplate",
    subjectPart: "Verifique seu email - AUK Leilões",
    htmlPart: `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Verificação de Email</title>
        </head>
        <body>
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #143d64; color: white; padding: 20px; text-align: center;">
                    <h1>Verificação de Email</h1>
                </div>
                <div style="padding: 20px;">
                    <p>Olá {{name}},</p>
                    <p>Por favor, clique no link abaixo para verificar seu email:</p>
                    <p><a href="{{verificationLink}}">Verificar Email</a></p>
                </div>
            </div>
        </body>
        </html>
    `,
    textPart: "Olá {{name}}, clique no link para verificar seu email: {{verificationLink}}"
};

export { CreateEmailTemplate };
