import { Router } from 'express'
import multer from 'multer'
import { ApplyUseCase } from '../middlewares/ApllyUseCases'
import MainAuctUsecases from '../../app/usecases/auct/MainAuctUsecases'
const router = Router()
const upload = multer()

const mainAuct = new MainAuctUsecases()

router.post('/create-auct', ApplyUseCase(mainAuct.CreateAuct))//testado
router.get('/find-auct', ApplyUseCase(mainAuct.FindAuct))//testado
router.get('/find-by-nanoid', ApplyUseCase(mainAuct.FindAuctByNanoId))//
router.get('/list-auct', ApplyUseCase(mainAuct.ListAuct))//testado
router.patch('/update-auct', ApplyUseCase(mainAuct.UpdateAuct))//testado
router.delete('/delete-auct', ApplyUseCase(mainAuct.DeleteAuct))//testado

router.post('/upload-cover-auct',upload.single("cover-auct-image"), ApplyUseCase(mainAuct.FirebaseUploadCoverAuct))
router.delete('/delete-cover-auct', ApplyUseCase(mainAuct.FirebaseDeleteCoverAuct))


export default router;