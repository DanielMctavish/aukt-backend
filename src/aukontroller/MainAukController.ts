import { IEngineFloorStatus, IMainAukController, IQuerys } from "./IMainAukController";
import { addTime } from "./usecases/AddTime";
import { killAuk } from "./usecases/KillAuk";
import { nextProduct } from "./usecases/NextProduct";
import { pauseAuk } from "./usecases/PauseAuk";
import { playAuk } from "./usecases/PlayAuk";
import { resumeAuk } from "./usecases/ResumeAuk";

class MainAukController implements IMainAukController {
    async PlayAuk(querys: IQuerys): Promise<Partial<IEngineFloorStatus>> {
        return playAuk(querys.auct_id, querys.group)
    }
    async ResumeAuk(querys: IQuerys): Promise<Partial<IEngineFloorStatus>> {
        return resumeAuk(querys.auct_id)
    }
    async PauseAuk(querys: IQuerys): Promise<Partial<IEngineFloorStatus>> {
        return pauseAuk(querys.auct_id)
    }
    async AddTime(querys: IQuerys): Promise<Partial<IEngineFloorStatus>> {
        return addTime(querys.auct_id, querys.time)
    }
    async NextProduct(querys: IQuerys): Promise<Partial<IEngineFloorStatus>> {
        return nextProduct(querys.auct_id)
    }
    async KillAuk(querys: IQuerys): Promise<Partial<IEngineFloorStatus>> {
        return killAuk(querys.auct_id)
    }
}

const controllerInstance = new MainAukController()

export { controllerInstance };