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

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');


        if (typeof usecase !== 'function') {
            // Se usecase não for uma função ou não tiver uma função handle, retorne um erro
            return res.status(500).send({ message: 'Erro interno do servidor' });
        }


        await usecase(data.body, data?.query, data?.file, data?.files)
            .then((response: any) => {
                // console.log('resposta do applyusecase --> ', response);
                return res.status(response.status_code).send(response.body)
            }).catch((err: any) => {

                // console.log('erro do applyusecase --> ', err);
                return res.status(err.status_code).send(err.body)

            })

    }

    return applyResponse
}