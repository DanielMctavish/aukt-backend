interface IEngineFloorStatus {
    duration: number
    timer: number
    group: string
    product_id: string
    auct_id: string
    status: FLOOR_STATUS
    interval: NodeJS.Timeout
    nextProductIndex: number,
    response: {
        status: number
        body: Object
    }
}

enum FLOOR_STATUS {
    PLAYING,
    PAUSED,
    COMPLETED
}

interface IQuerys {
    auct_id: string
    group: string
    time: number
}

interface IMainAukController {
    PlayAuk(querys: IQuerys): Promise<Partial<IEngineFloorStatus>>;
    ResumeAuk(querys: IQuerys): Promise<Partial<IEngineFloorStatus>>;
    PauseAuk(querys: IQuerys): Promise<Partial<IEngineFloorStatus>>;
    AddTime(querys: IQuerys): Promise<Partial<IEngineFloorStatus>>;
    NextProduct(querys: IQuerys): Promise<Partial<IEngineFloorStatus>>;
    KillAuk(querys: IQuerys): Promise<Partial<IEngineFloorStatus>>;
}


export { IEngineFloorStatus, IMainAukController, IQuerys, FLOOR_STATUS }