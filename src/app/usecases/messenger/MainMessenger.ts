import { ICartela } from "../../entities/ICartela";
import { IMainMessenger, MessengerResponse, EmailTemplateData } from "../IMainMessenger";
import { CreateEmailTemplate } from "./CreateEmailTemplate";
import SendConfirmationEmail from "./SendConfirmationEmail";
import { sendEmail } from "./SendEmail";


interface DataConfirmEmail {
    emailTo: string
    clientId: string
}

class MainMessenger implements IMainMessenger {
    SendEmail(cartela: ICartela, emailTo: string): Promise<MessengerResponse> {
        return sendEmail(cartela, emailTo)
    }
    SendConfirmationEmail(data: DataConfirmEmail): Promise<MessengerResponse> {
        return SendConfirmationEmail(data.emailTo, data.clientId)
    }

    CreateEmailTemplate(data: EmailTemplateData): Promise<MessengerResponse> {
        return CreateEmailTemplate(data)
    }
}

export default MainMessenger;
