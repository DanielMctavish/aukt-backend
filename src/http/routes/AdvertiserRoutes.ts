import { Router } from 'express'
import { ApplyUseCase } from '../middlewares/ApllyUseCases'
import MainAdvertiserUsecases from '../../app/usecases/advertiser/MainAdvertiserUsecases'
const router = Router()

const mainAdvertiser = new MainAdvertiserUsecases()

router.post('/create-advertiser', ApplyUseCase(mainAdvertiser.CreateAdvertiser))//testado
router.get('/find', ApplyUseCase(mainAdvertiser.FindAdvertiser))//testado
router.get('/find-by-email', ApplyUseCase(mainAdvertiser.FindAdvertiserByEmail))//testado
router.patch('/update', ApplyUseCase(mainAdvertiser.UpdateAdvertiser))//testado
router.delete('/delete', ApplyUseCase(mainAdvertiser.DeleteAdvertiser))//testado


export default router;