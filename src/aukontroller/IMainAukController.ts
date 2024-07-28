interface IFloorStatus {
    duration: number
    timer: number
    group: string
    product_id: string
    auct_id: string
    status: FLOOR_STATUS
    interval: NodeJS.Timeout
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
    PlayAuk(querys: IQuerys): Promise<Partial<IFloorStatus>>;
    ResumeAuk(querys: IQuerys): Promise<Partial<IFloorStatus>>
    PauseAuk(querys: IQuerys): Promise<Partial<IFloorStatus>>;
    AddTime(querys: IQuerys): Promise<Partial<IFloorStatus>>;
    KillAuk(querys: IQuerys): Promise<Partial<IFloorStatus>>
}


export { IFloorStatus, IMainAukController, IQuerys, FLOOR_STATUS }