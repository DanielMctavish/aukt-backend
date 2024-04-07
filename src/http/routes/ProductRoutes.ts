import { Router } from 'express'
import { ApplyUseCase } from '../middlewares/ApllyUseCases'
import MainProductUsecases from '../../app/usecases/product/MainProductUsecases'
import multer from "multer"
import { verifyToken } from '../../authentication/JWT'
const router = Router()
const upload = multer()

const mainProducts = new MainProductUsecases()

router.post('/create-product', ApplyUseCase(mainProducts.create))//testado
router.get('/find', ApplyUseCase(mainProducts.find))//testado
router.get('/list-by-advertiser', ApplyUseCase(mainProducts.listByAdvertiserId))//testado
router.patch('/update', ApplyUseCase(mainProducts.update))//testado
router.delete('/delete', ApplyUseCase(mainProducts.delete))//testado

router.post('/upload-cover-img', upload.single('aukt-product-img'), ApplyUseCase(mainProducts.FirebaseUploadProductCover))
router.post('/upload-products-imgs', upload.array('aukt-products-imgs', 10), ApplyUseCase(mainProducts.FirebaseUploadProductImgs))
router.delete('/delete-product-img', ApplyUseCase(mainProducts.FirebaseDeleteProductImg))

export default router;