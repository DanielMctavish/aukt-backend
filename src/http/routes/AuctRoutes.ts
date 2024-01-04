import { Router } from 'express'
import { ApplyUseCase } from '../middlewares/ApllyUseCases'
import MainAuctUsecases from '../../app/usecases/auct/MainAuctUsecases'
const router = Router()

const mainAuct = new MainAuctUsecases()

router.post('/create-auct', ApplyUseCase(mainAuct.CreateAuct))//testado
router.get('/find-auct', ApplyUseCase(mainAuct.FindAuct))//testado
router.get('/list-auct', ApplyUseCase(mainAuct.ListAuct))//testado
router.patch('/update-auct', ApplyUseCase(mainAuct.UpdateAuct))//testado
router.delete('/delete-auct', ApplyUseCase(mainAuct.DeleteAuct))//testado


export default router;