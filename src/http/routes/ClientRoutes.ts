import { Router } from 'express'
import { ApplyUseCase } from '../middlewares/ApllyUseCases'
import MainClientUsecases from '../../app/usecases/client/MainClientUsecases'
import multer from 'multer'
import { verifyToken } from '../../authentication/JWT'

const router = Router()
const upload = multer()

const mainClient = new MainClientUsecases()

router.post('/create-client', ApplyUseCase(mainClient.CreateClient))//testado
router.get('/find-client', verifyToken, ApplyUseCase(mainClient.FindClient))//testado
router.get('/find-by-email', verifyToken, ApplyUseCase(mainClient.FindClientByEmail))//testado
router.get('/list-clients', verifyToken, ApplyUseCase(mainClient.ListClient))//testado
router.patch('/update-client', verifyToken, ApplyUseCase(mainClient.UpdateClient))//testado
router.delete('/delete-client', verifyToken, ApplyUseCase(mainClient.DeleteClient))//testado

// AUCT OPERATIONS

router.post("/bid-auct", verifyToken, ApplyUseCase(mainClient.BidAuct))//testado
router.get("/list-bid", verifyToken, ApplyUseCase(mainClient.ListBidByClientId))//testado
router.post("/subscribed-auct", verifyToken, ApplyUseCase(mainClient.SubscribedAuct))//testado
router.get("/find-bid", verifyToken, ApplyUseCase(mainClient.FindBid))//development...

//ACCESS

router.post("/login", ApplyUseCase(mainClient.LoginClient))//testado

//FIREBASE AUKT

router.post("/upload-client-profile", verifyToken, upload.single('aukt-client-profile'), ApplyUseCase(mainClient.FirebaseUploadClientProfile))
router.delete("/delete-client-profile", verifyToken, ApplyUseCase(mainClient.FirebaseDeleteClientProfile))

export default router;