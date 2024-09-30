import { IFloorStatus, IMainAukController, IQuerys } from "./IMainAukController";
import { addTime } from "./usecases/AddTime";
import { killAuk } from "./usecases/KillAuk";
import { nextProduct } from "./usecases/NextProduct";
import { pauseAuk } from "./usecases/PauseAuk";
import { playAuk } from "./usecases/PlayAuk";
import { resumeAuk } from "./usecases/ResumeAuk";

class MainAukController implements IMainAukController {
    public auk_sockets: Partial<IFloorStatus>[] = []

    async PlayAuk(querys: IQuerys): Promise<Partial<IFloorStatus>> {
        return playAuk(querys.auct_id, querys.group)
    }
    async ResumeAuk(querys: IQuerys): Promise<Partial<IFloorStatus>> {
        return resumeAuk(querys.auct_id)
    }
    async PauseAuk(querys: IQuerys): Promise<Partial<IFloorStatus>> {
        return pauseAuk(querys.auct_id)
    }
    async AddTime(querys: IQuerys): Promise<Partial<IFloorStatus>> {
        return addTime(querys.auct_id, querys.time)
    }
    async NextProduct(querys: IQuerys): Promise<Partial<IFloorStatus>> {
        return nextProduct(querys.auct_id)
    }
    async KillAuk(querys: IQuerys): Promise<Partial<IFloorStatus>> {
        return killAuk(querys.auct_id)
    }
}

const controllerInstance = new MainAukController()

export { controllerInstance };