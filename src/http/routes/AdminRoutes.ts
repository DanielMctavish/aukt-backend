import { Router } from 'express'
import { ApplyUseCase } from '../middlewares/ApllyUseCases'
import multer from 'multer'
const router = Router()
const upload = multer()

import MainAdministrator_usecases from '../../app/usecases/adm/MainAdmin_usecases'
import { verifyToken } from '../../authentication/JWT'
const mainAdmin = new MainAdministrator_usecases()

router.post('/create-administrator', ApplyUseCase(mainAdmin.CreateAdministrator))//testado 
router.get('/find', verifyToken, ApplyUseCase(mainAdmin.FindAdministrator))//testado
router.get('/find-by-email', verifyToken, ApplyUseCase(mainAdmin.FindAdministratorByEmail))//testado
router.patch('/update', verifyToken, ApplyUseCase(mainAdmin.UpdateAdministrator))//testado

router.post("/login", ApplyUseCase(mainAdmin.LoginAdm))//testado

//FIREBASE.................................................................................

router.post("/upload-admin-profile", verifyToken, upload.single('company-logo'), ApplyUseCase(mainAdmin.FirebaseUploadPhotoProfile))
router.delete("/delete-admin-profile", verifyToken, ApplyUseCase(mainAdmin.FirebaseDeletePhotoProfile))

export default router;