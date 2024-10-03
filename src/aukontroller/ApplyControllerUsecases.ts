import { Request, Response } from 'express'
import { IEngineFloorStatus } from './IMainAukController';


function ApplyControllerUsecases(Usecase: Function) {

    return async (req: Request, res: Response) => {

        if (!Usecase) {
            return res.status(500).json({ body: "no usecase provided" })

        }

        await Usecase(req.query)
            .then((result: Partial<IEngineFloorStatus>) => {
                return res.status(result.response ? result.response.status : 200)
                    .json(result.response?.body)
            })

    }

}


export default ApplyControllerUsecases;