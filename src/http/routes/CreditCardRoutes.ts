import { Router } from 'express'
import { ApplyUseCase } from '../middlewares/ApllyUseCases'
import MainCreditCardUsecases from '../../app/usecases/credit-card/MainCreditCardUsecases'
const router = Router()

const mainCreditCard = new MainCreditCardUsecases()

router.post('/create-credit-card', ApplyUseCase(mainCreditCard.create))//testado
router.get('/find', ApplyUseCase(mainCreditCard.find))//testado
router.get('/list-by-admin', ApplyUseCase(mainCreditCard.listByAdminID))//testado
router.get('/list-by-advertiser', ApplyUseCase(mainCreditCard.listByAdvertiserID))//testado
router.get('/list-by-client', ApplyUseCase(mainCreditCard.listByClientID))//testado
router.delete('/delete', ApplyUseCase(mainCreditCard.delete))//testado

export default router;