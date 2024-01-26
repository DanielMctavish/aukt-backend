import { Router } from 'express'
import { ApplyUseCase } from '../middlewares/ApllyUseCases'
import MainClientUsecases from '../../app/usecases/client/MainClientUsecases'
import multer from 'multer'

const router = Router()
const upload = multer()

const mainClient = new MainClientUsecases()

router.post('/create-client', ApplyUseCase(mainClient.CreateClient))//testado
router.get('/find-client', ApplyUseCase(mainClient.FindClient))//testado
router.get('/find-by-email', ApplyUseCase(mainClient.FindClientByEmail))//testado
router.get('/list-clients', ApplyUseCase(mainClient.ListClient))//testado
router.patch('/update-client', ApplyUseCase(mainClient.UpdateClient))//testado
router.delete('/delete-client', ApplyUseCase(mainClient.DeleteClient))//testado

// AUCT OPERATIONS

router.post("/bid-auct", ApplyUseCase(mainClient.BidAuct))//testado
router.post("/subscribed-auct", ApplyUseCase(mainClient.SubscribedAuct))//testado

//ACCESS

router.post("/login", ApplyUseCase(mainClient.LoginClient))//testado

//FIREBASE AUKT

router.post("/upload-client-profile", upload.single('aukt-client-profile'), ApplyUseCase(mainClient.FirebaseUploadClientProfile))
router.delete("/delete-client-profile", ApplyUseCase(mainClient.FirebaseDeleteClientProfile))

export default router;