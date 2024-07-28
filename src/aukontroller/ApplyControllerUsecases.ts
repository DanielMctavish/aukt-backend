import { Request, Response } from 'express'
import { IFloorStatus } from './IMainAukController';



function ApplyControllerUsecases(Usecase: Function) {

    async (req: Request, res: Response) => {

        if (!Usecase) {
            res.status(500).json({ body: "no usecase provided" })
            return
        }

        await Usecase(req.query)
            .then((result: Partial<IFloorStatus>) => {
                res.status(result.response ? result.response.status : 200)
                    .json(result.response?.body)
            })

    }

}


export default ApplyControllerUsecases;