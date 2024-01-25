import { Router } from 'express'
import { ApplyUseCase } from '../middlewares/ApllyUseCases'
const router = Router()

import MainModerator from '../../app/usecases/moderator/MainModerator'
const mainModerator = new MainModerator()

router.post('/create-moderator', ApplyUseCase(mainModerator.CreateModerator))//
router.get('/find', ApplyUseCase(mainModerator.FindModerator))
router.get('/find-by-email', ApplyUseCase(mainModerator.FindModeratorByEmail))
router.patch('/update', ApplyUseCase(mainModerator.UpdateModerator))

router.post("/login",ApplyUseCase(mainModerator.LoginModerator))

export default router;