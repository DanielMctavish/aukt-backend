import { IMainMessenger, MessengerResponse, EmailTemplateData } from "../IMainMessenger";
import { CreateEmailTemplate } from "./CreateEmailTemplate";
import SendConfirmationEmail from "./SendConfirmationEmail";
import { sendEmail } from "./SendEmail";


interface DataConfirmEmail {
    emailTo: string
    clientId: string
}

interface DataSendEmailCartela {
    cartelaId: string
    emailTo: string
}

class MainMessenger implements IMainMessenger {
    SendEmail(data:DataSendEmailCartela ): Promise<MessengerResponse> {
        return sendEmail(data)
    }
    SendConfirmationEmail(data: DataConfirmEmail): Promise<MessengerResponse> {
        return SendConfirmationEmail(data.emailTo, data.clientId)
    }

    CreateEmailTemplate(data: EmailTemplateData): Promise<MessengerResponse> {
        return CreateEmailTemplate(data)
    }
}

export  {MainMessenger, DataSendEmailCartela};
