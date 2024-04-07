import { ICreditCard } from "../../entities/ICreditCard";
import IMainCreditCard, { CreditCardResponse } from "../IMainCreditCard";
import { createCreditCard } from "./functions/CreateCreditCard";
import { deleteCreditCard } from "./functions/DeleteClient";
import { findCreditCard } from "./functions/FindCreditCard";
import { listCreditCardByAdmin } from "./functions/ListByAdmin";
import { listCreditCardByAdvertiser } from "./functions/ListByAdvertiser";
import { listCreditCardByClient } from "./functions/ListByClient";

interface params {
    credit_id: string
    admin_id: string
    advertiser_id: string
    client_id: string
}

class MainCreditCardUsecases implements IMainCreditCard {
    create(data: ICreditCard): Promise<CreditCardResponse> {
        return createCreditCard(data)
    }
    find(data: any, params: params): Promise<CreditCardResponse> {
        return findCreditCard(params.credit_id)
    }
    listByAdminID(data: any, params: params): Promise<CreditCardResponse> {
        return listCreditCardByAdmin(params.admin_id)
    }
    listByAdvertiserID(data: any, params: params): Promise<CreditCardResponse> {
        return listCreditCardByAdvertiser(params.advertiser_id)
    }
    listByClientID(data: any, params: params): Promise<CreditCardResponse> {
        return listCreditCardByClient(params.client_id)
    }
    delete(data: any, params: params): Promise<CreditCardResponse> {
        return deleteCreditCard(params.credit_id)
    }
}

export default MainCreditCardUsecases