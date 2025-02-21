import { ICartela } from "../entities/ICartela";


interface MessengerResponse {
    status_code: number;
    body: Object;
}
interface DataConfirmEmail {
    emailTo: string
    clientId: string
}

interface EmailTemplateData {
    templateName: string;
    subjectPart: string;
    htmlPart: string;
    textPart: string;
}

interface IMainMessenger {
    SendEmail(cartela: ICartela, emailTo: string): Promise<MessengerResponse>
    SendConfirmationEmail(data: DataConfirmEmail): Promise<MessengerResponse>
    CreateEmailTemplate(data: EmailTemplateData): Promise<MessengerResponse>
}


export { IMainMessenger, MessengerResponse, EmailTemplateData };