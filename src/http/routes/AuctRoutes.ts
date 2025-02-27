import ApplyControllerUsecases from '../../aukontroller/ApplyControllerUsecases'
import { Router } from 'express'
import multer from 'multer'
import { ApplyUseCase } from '../middlewares/ApllyUseCases'
import MainAuctUsecases from '../../app/usecases/auct/MainAuctUsecases'
import { verifyToken } from '../../authentication/JWT'
import { controllerInstance } from '../../aukontroller/MainAukController'

const router = Router()
const upload = multer()

const mainAuct = new MainAuctUsecases()

router.post('/create-auct', verifyToken, ApplyUseCase(mainAuct.CreateAuct))//testado
router.get('/find-auct', ApplyUseCase(mainAuct.FindAuct))//testado
router.get('/find-by-nanoid', verifyToken, ApplyUseCase(mainAuct.FindAuctByNanoId))//
router.get('/list-auct', ApplyUseCase(mainAuct.ListAuct))//testado
router.get('/list-auct-bystatus', ApplyUseCase(mainAuct.ListAuctByStatus))//testado
router.patch('/update-auct', verifyToken, ApplyUseCase(mainAuct.UpdateAuct))//testado
router.delete('/delete-auct', verifyToken, ApplyUseCase(mainAuct.DeleteAuct))//testado

router.post('/upload-cover-auct', upload.single("cover-auct-image"), ApplyUseCase(mainAuct.FirebaseUploadCoverAuct))
router.delete('/delete-cover-auct', ApplyUseCase(mainAuct.FirebaseDeleteCoverAuct))

router.get('/get-all-auctions/2-products', ApplyUseCase(mainAuct.GetAllAuctions))

//ControllerAuct............................................................................................................
router.get('/start-auct', verifyToken, ApplyControllerUsecases(controllerInstance.PlayAuk))//testado
router.get('/pause-product-time', verifyToken, ApplyControllerUsecases(controllerInstance.PauseAuk))//testado
router.get('/resume-floor', verifyToken, ApplyControllerUsecases(controllerInstance.ResumeAuk))//testado
router.get('/change-product-time', verifyToken, ApplyControllerUsecases(controllerInstance.AddTime))//testado
router.get('/next-product', verifyToken, ApplyControllerUsecases(controllerInstance.NextProduct))//testado...
router.get('/kill-auct', verifyToken, ApplyControllerUsecases(controllerInstance.KillAuk))//testado...

//counter.....................................................................................................................

router.get('/counter', ApplyUseCase(mainAuct.CounterAucts))//in development
export default router;