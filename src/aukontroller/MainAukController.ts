import { IFloorStatus, IMainAukController, IQuerys } from "./IMainAukController";
import { addTime } from "./usecases/AddTime";
import { killAuk } from "./usecases/KillAuk";
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
    async KillAuk(querys: IQuerys): Promise<Partial<IFloorStatus>> {
        return killAuk(querys.auct_id)
    }
}


export default MainAukController;