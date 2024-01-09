import { Router } from 'express'
import { ApplyUseCase } from '../middlewares/ApllyUseCases'
import MainClientUsecases from '../../app/usecases/client/MainClientUsecases'

const router = Router()

const mainClient = new MainClientUsecases()

router.post('/create-client', ApplyUseCase(mainClient.CreateClient))//testado
router.get('/find-client', ApplyUseCase(mainClient.FindClient))//testado
router.get('/find-by-email', ApplyUseCase(mainClient.FindClientByEmail))//testado
router.get('/list-clients', ApplyUseCase(mainClient.ListClient))//testado
router.patch('/update-client', ApplyUseCase(mainClient.UpdateClient))//testado
router.delete('/delete-client', ApplyUseCase(mainClient.DeleteClient))//testado

// AUCT OPERATIONS

router.post("/bid-auct", ApplyUseCase(mainClient.BidAuct))//testado
router.post("/subscribed-auct", ApplyUseCase(mainClient.SubscribedAuct))//testado


export default router;