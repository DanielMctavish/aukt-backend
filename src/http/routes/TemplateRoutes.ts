import { Router } from 'express'
import { ApplyUseCase } from '../middlewares/ApllyUseCases'
import MainTemplateUsecases from '../../app/usecases/template/MainTemplateUsecases'
import { verifyToken } from '../../authentication/JWT'

const router = Router()
const mainTemplate = new MainTemplateUsecases()

router.post('/create-template', verifyToken, ApplyUseCase(mainTemplate.CreateSiteTemplate))
router.get('/find', ApplyUseCase(mainTemplate.FindSiteTemplate))
router.get('/find-by-id', ApplyUseCase(mainTemplate.FindTemplateById))
router.patch('/update-template', verifyToken, ApplyUseCase(mainTemplate.UpdateSiteTemplate))
router.delete('/delete', verifyToken, ApplyUseCase(mainTemplate.DeleteSiteTemplate))

export default router; 