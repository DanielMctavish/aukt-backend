import { Router } from 'express'
import { ApplyUseCase } from '../middlewares/ApllyUseCases'
import MainAdvertiserUsecases from '../../app/usecases/advertiser/MainAdvertiserUsecases'
import multer from "multer"
import { verifyToken } from '../../authentication/JWT'

const router = Router()
const upload = multer()

const mainAdvertiser = new MainAdvertiserUsecases()

router.post('/create-advertiser', ApplyUseCase(mainAdvertiser.CreateAdvertiser))//testado x2
router.get('/find',ApplyUseCase(mainAdvertiser.FindAdvertiser))//testado
router.get('/find-by-email', verifyToken, ApplyUseCase(mainAdvertiser.FindAdvertiserByEmail))//testado
router.patch('/update', verifyToken, ApplyUseCase(mainAdvertiser.UpdateAdvertiser))//testado
router.delete('/delete', verifyToken, ApplyUseCase(mainAdvertiser.DeleteAdvertiser))//testado

router.get('/verify',(req,res)=>{
    res.send('ok! rota acessada')
})

router.post("/login", ApplyUseCase(mainAdvertiser.LoginAdvertiser))//testado

//data/params/file/files
router.post("/upload-cover-profile", verifyToken, upload.single('cover-blog-post'), ApplyUseCase(mainAdvertiser.FirebaseUploadPhotoProfile))

router.delete("/delete-profile", verifyToken, ApplyUseCase(mainAdvertiser.FirebaseDeletePhotoProfile))

router.post("/upload-logo-company", verifyToken, upload.single('cover-blog-post'), ApplyUseCase(mainAdvertiser.FirebaseUploadLogoCompany))

router.delete("/delete-logo-company", verifyToken, ApplyUseCase(mainAdvertiser.FirebaseDeleteLogoCompany))


export default router;