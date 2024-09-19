import { ICartela } from "../../entities/ICartela";
import IMainCartela, { CartelaResponse, paramsCartela } from "../IMainCartela";
import { createCartela } from "./functions/CreateCartela";
import { deleteCartela } from "./functions/DeleteCartela";
import { findCartela } from "./functions/FindCartela";
import { listCartela } from "./functions/ListCartela";
import { listCartelaByClient } from "./functions/ListCartelaByClient";
import { updateCartela } from "./functions/UpdateCartela";

class MainCartelaUsecases implements IMainCartela {

    async CreateCartela(data: ICartela): Promise<CartelaResponse> {
        return createCartela(data)
    }

    async FindCartela(data: any, params: paramsCartela): Promise<CartelaResponse> {
        return findCartela(params.cartela_id)
    }

    async ListCartela(data: any, params: paramsCartela): Promise<CartelaResponse> {
        return listCartela( params.auction_id) 
    }

    async ListCartelaByClient(data: any, params: paramsCartela): Promise<CartelaResponse> {
        return listCartelaByClient(params.client_id)
    }

    async UpdateCartela(data: ICartela, params: paramsCartela): Promise<CartelaResponse> {
        return updateCartela(data, params.cartela_id)
    }

    async DeleteCartela(data: any, params: paramsCartela): Promise<CartelaResponse> {
        return deleteCartela(params.cartela_id)
    }

}

export default MainCartelaUsecases