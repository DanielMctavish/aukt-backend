import { Router } from 'express'
import { ApplyUseCase } from '../middlewares/ApllyUseCases'
import MainProductUsecases from '../../app/usecases/product/MainProductUsecases'
const router = Router()

const mainProducts = new MainProductUsecases()

router.post('/create', ApplyUseCase(mainProducts.create))//testado
router.get('/find', ApplyUseCase(mainProducts.find))//testado
router.get('/list-by-advertiser', ApplyUseCase(mainProducts.listByAdvertiserId))//testado
router.patch('/update', ApplyUseCase(mainProducts.update))//testado
router.delete('/delete', ApplyUseCase(mainProducts.delete))//testado

export default router;