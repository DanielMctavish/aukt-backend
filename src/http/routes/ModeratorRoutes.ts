import { Router } from 'express'
import { ApplyUseCase } from '../middlewares/ApllyUseCases'
import multer from "multer"
const router = Router()
const upload = multer()

import MainModerator from '../../app/usecases/moderator/MainModerator'
const mainModerator = new MainModerator()

router.post('/create', ApplyUseCase(mainModerator.CreateModerator))//
router.get('/find', ApplyUseCase(mainModerator.FindModerator))
router.get('/find-by-email', ApplyUseCase(mainModerator.FindModeratorByEmail))
router.patch('/update', ApplyUseCase(mainModerator.UpdateModerator))

router.post("/login",ApplyUseCase(mainModerator.LoginModerator))

//FIREBASE
router.post("/upload-profile",upload.single("aukt-profile-moderator"),ApplyUseCase(mainModerator.UploadProfile))
router.delete("/delete-profile",ApplyUseCase(mainModerator.DeleteProfile))

export default router;