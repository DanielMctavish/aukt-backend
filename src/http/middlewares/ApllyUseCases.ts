import { Request, Response } from 'express'

export const ApplyUseCase = (usecase: Function) => {
    
    const applyResponse = async (req: Request | any, res: Response) => {

        let data = {
            file: req.file,
            files: req.files,
            query: req.query,
            params: req.params,
            body: req.body
        }

        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT,PATCH, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.header('Access-Control-Allow-Credentials', 'true');

        if (typeof usecase !== 'function') {
            return res.status(500).send({ message: 'Erro interno do servidor' });
        }

        await usecase(data.body, data?.query, data?.file, data?.files)
            .then((response: any) => {
                return res.status(response.status_code).send(response.body)
            }).catch((err: any) => {
                return res.status(err.status_code).send(err.body)
            })

    }
    return applyResponse
}