import { Router } from 'express'
import multer from 'multer'
import { ApplyUseCase } from '../middlewares/ApllyUseCases'
import MainAuctUsecases from '../../app/usecases/auct/MainAuctUsecases'
import { verifyToken } from '../../authentication/JWT'
const router = Router()
const upload = multer()

const mainAuct = new MainAuctUsecases()

router.post('/create-auct', verifyToken, ApplyUseCase(mainAuct.CreateAuct))//testado
router.get('/find-auct', verifyToken, ApplyUseCase(mainAuct.FindAuct))//testado
router.get('/find-by-nanoid', verifyToken, ApplyUseCase(mainAuct.FindAuctByNanoId))//
router.get('/list-auct', verifyToken, ApplyUseCase(mainAuct.ListAuct))//testado
router.patch('/update-auct', verifyToken, ApplyUseCase(mainAuct.UpdateAuct))//testado
router.delete('/delete-auct', verifyToken, ApplyUseCase(mainAuct.DeleteAuct))//testado

router.post('/upload-cover-auct', verifyToken, upload.single("cover-auct-image"), ApplyUseCase(mainAuct.FirebaseUploadCoverAuct))
router.delete('/delete-cover-auct', verifyToken, ApplyUseCase(mainAuct.FirebaseDeleteCoverAuct))


export default router;