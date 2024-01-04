import { Router } from 'express'
import { ApplyUseCase } from '../middlewares/ApllyUseCases'
const router = Router()

import MainAdministrator_usecases from '../../app/usecases/adm/MainAdmin_usecases'
const mainAdmin = new MainAdministrator_usecases()

router.post('/create-administrator', ApplyUseCase(mainAdmin.CreateAdministrator))//testado
router.get('/find', ApplyUseCase(mainAdmin.FindAdministrator))//testado
router.get('/find-by-email', ApplyUseCase(mainAdmin.FindAdministratorByEmail))//testado
router.patch('/update', ApplyUseCase(mainAdmin.UpdateAdministrator))//testado


export default router;