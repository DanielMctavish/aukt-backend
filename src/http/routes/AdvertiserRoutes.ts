import { Router } from 'express'
import { ApplyUseCase } from '../middlewares/ApllyUseCases'
import MainAdvertiserUsecases from '../../app/usecases/advertiser/MainAdvertiserUsecases'
import multer from "multer"

const router = Router()
const upload = multer()

const mainAdvertiser = new MainAdvertiserUsecases()

router.post('/create-advertiser', ApplyUseCase(mainAdvertiser.CreateAdvertiser))//testado
router.get('/find', ApplyUseCase(mainAdvertiser.FindAdvertiser))//testado
router.get('/find-by-email', ApplyUseCase(mainAdvertiser.FindAdvertiserByEmail))//testado
router.patch('/update', ApplyUseCase(mainAdvertiser.UpdateAdvertiser))//testado
router.delete('/delete', ApplyUseCase(mainAdvertiser.DeleteAdvertiser))//testado

router.post("/login", ApplyUseCase(mainAdvertiser.LoginAdvertiser))//testado

//data/params/file/files
router.post("/upload-cover-profile", upload.single('cover-blog-post'), ApplyUseCase(mainAdvertiser.FirebaseUploadPhotoProfile))

router.delete("/delete-profile", ApplyUseCase(mainAdvertiser.FirebaseDeletePhotoProfile))

router.post("/upload-logo-company", upload.single('cover-blog-post'), ApplyUseCase(mainAdvertiser.FirebaseUploadLogoCompany))

router.delete("/delete-logo-company",  ApplyUseCase(mainAdvertiser.FirebaseDeleteLogoCompany))


export default router;