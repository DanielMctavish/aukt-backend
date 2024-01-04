import { Router } from 'express'
import { ApplyUseCase } from '../middlewares/ApllyUseCases'
import MainCreditCardUsecases from '../../app/usecases/credit-card/MainCreditCardUsecases'
const router = Router()

const mainCreditCard = new MainCreditCardUsecases()

router.post('/create', ApplyUseCase(mainCreditCard.create))
router.get('/find', ApplyUseCase(mainCreditCard.find))
router.patch('/list-by-admin', ApplyUseCase(mainCreditCard.listByAdminID))
router.patch('/list-by-advertiser', ApplyUseCase(mainCreditCard.listByAdvertiserID))
router.patch('/list-by-client', ApplyUseCase(mainCreditCard.listByClientID))
router.delete('/delete', ApplyUseCase(mainCreditCard.delete))

export default router;