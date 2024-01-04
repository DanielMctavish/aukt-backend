import { Router } from 'express'
import { ApplyUseCase } from '../middlewares/ApllyUseCases'
import MainProductUsecases from '../../app/usecases/product/MainProductUsecases'
const router = Router()

const mainProducts = new MainProductUsecases()

router.post('/create', ApplyUseCase(mainProducts.create))
router.get('/find', ApplyUseCase(mainProducts.find))
router.get('/list-by-advertiser', ApplyUseCase(mainProducts.listByAdvertiserId))
router.patch('/update', ApplyUseCase(mainProducts.update))
router.delete('/delete', ApplyUseCase(mainProducts.delete))

export default router;