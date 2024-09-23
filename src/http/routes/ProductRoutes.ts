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
router.get('/list-by-filters', ApplyUseCase(mainProducts.listProductsByFilters))//testado
router.get("/list-by-title", ApplyUseCase(mainProducts.findByTitle))//testado
router.get('/list-by-advertiser', ApplyUseCase(mainProducts.listByAdvertiserId))//testado
router.get('/list-by-categorie', ApplyUseCase(mainProducts.listByCategorie))//in development....
router.patch('/update-product', verifyToken, ApplyUseCase(mainProducts.update))//testado
router.delete('/delete', ApplyUseCase(mainProducts.delete))//testado

router.post('/upload-cover-img', upload.single('aukt-product-img'), ApplyUseCase(mainProducts.FirebaseUploadProductCover))
router.post('/upload-products-imgs', upload.array('aukt-products-imgs', 10), ApplyUseCase(mainProducts.FirebaseUploadProductImgs))
router.delete('/delete-product-img', ApplyUseCase(mainProducts.FirebaseDeleteProductImg))

// New routes for product counters
router.get('/count-products', ApplyUseCase(mainProducts.CounterProducts))
router.get('/count-products-with-bids', ApplyUseCase(mainProducts.CounterProductsWithBids))

export default router;