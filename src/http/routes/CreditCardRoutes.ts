import { Router } from 'express'
import { ApplyUseCase } from '../middlewares/ApllyUseCases'
import MainCreditCardUsecases from '../../app/usecases/credit-card/MainCreditCardUsecases'
const router = Router()

const mainCreditCard = new MainCreditCardUsecases()

router.post('/create', ApplyUseCase(mainCreditCard.create))//
router.get('/find', ApplyUseCase(mainCreditCard.find))
router.get('/list-by-admin', ApplyUseCase(mainCreditCard.listByAdminID))
router.get('/list-by-advertiser', ApplyUseCase(mainCreditCard.listByAdvertiserID))
router.get('/list-by-client', ApplyUseCase(mainCreditCard.listByClientID))
router.delete('/delete', ApplyUseCase(mainCreditCard.delete))

export default router;