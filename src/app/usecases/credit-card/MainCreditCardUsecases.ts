import { ICreditCard } from "../../entities/ICreditCard";
import IMainCreditCard, { CreditCardResponse } from "../IMainCreditCard";
import { createCreditCard } from "./functions/CreateCreditCard";
import { deleteCreditCard } from "./functions/DeleteClient";
import { findCreditCard } from "./functions/FindCreditCard";
import { listCreditCardByAdmin } from "./functions/ListByAdmin";
import { listCreditCardByAdvertiser } from "./functions/ListByAdvertiser";
import { listCreditCardByClient } from "./functions/ListByClient";

class MainCreditCardUsecases implements IMainCreditCard {
    create(data: ICreditCard): Promise<CreditCardResponse> {
        return createCreditCard(data)
    }
    find(id: string): Promise<CreditCardResponse> {
        return findCreditCard(id)
    }
    listByAdminID(id: string): Promise<CreditCardResponse> {
        return listCreditCardByAdmin(id)
    }
    listByAdvertiserID(id: string): Promise<CreditCardResponse> {
        return listCreditCardByAdvertiser(id)
    }
    listByClientID(id: string): Promise<CreditCardResponse> {
        return listCreditCardByClient(id)
    }
    delete(id: string): Promise<CreditCardResponse> {
        return deleteCreditCard(id)
    }
}

export default MainCreditCardUsecases