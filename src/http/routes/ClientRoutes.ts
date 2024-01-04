import { Router } from 'express'
import { ApplyUseCase } from '../middlewares/ApllyUseCases'
import MainClientUsecases from '../../app/usecases/client/MainClientUsecases'

const router = Router()

const mainClient = new MainClientUsecases()

router.post('/create-client', ApplyUseCase(mainClient.CreateClient))//testado
router.get('/find-client', ApplyUseCase(mainClient.FindClient))
router.get('/find-by-email', ApplyUseCase(mainClient.FindClientByEmail))
router.get('/list-client', ApplyUseCase(mainClient.ListClient))
router.patch('/update-client', ApplyUseCase(mainClient.UpdateClient))
router.delete('/delete-client', ApplyUseCase(mainClient.DeleteClient))


export default router;