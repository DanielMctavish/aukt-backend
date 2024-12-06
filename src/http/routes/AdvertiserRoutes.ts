import { Router } from 'express'
import { ApplyUseCase } from '../middlewares/ApllyUseCases'
import MainAdvertiserUsecases from '../../app/usecases/advertiser/MainAdvertiserUsecases'
import multer from "multer"
import { verifyToken } from '../../authentication/JWT'

const router = Router()
const upload = multer({
    limits: {
        fileSize: 5 * 1024 * 1024, // Limite de 5MB
    },
})

const mainAdvertiser = new MainAdvertiserUsecases()

router.post('/create-advertiser', ApplyUseCase(mainAdvertiser.CreateAdvertiser))//testado x2
router.get('/find-advertiser', ApplyUseCase(mainAdvertiser.FindAdvertiser))//testado
router.get('/find-by-email', verifyToken, ApplyUseCase(mainAdvertiser.FindAdvertiserByEmail))//testado
router.patch('/update-advertiser', ApplyUseCase(mainAdvertiser.UpdateAdvertiser))//testado

router.delete('/delete', verifyToken, ApplyUseCase(mainAdvertiser.DeleteAdvertiser))//testado

router.post("/login", ApplyUseCase(mainAdvertiser.LoginAdvertiser))//testado

//data/params/file/files
router.post("/upload-cover-profile", upload.single('aukt-profile-advertiser'), ApplyUseCase(mainAdvertiser.FirebaseUploadPhotoProfile))
router.delete("/delete-profile", ApplyUseCase(mainAdvertiser.FirebaseDeletePhotoProfile))

router.post("/upload-logo-company", upload.single('aukt-company-advertiser'), ApplyUseCase(mainAdvertiser.FirebaseUploadLogoCompany))
router.delete("/delete-logo-company", ApplyUseCase(mainAdvertiser.FirebaseDeleteLogoCompany))


export default router;