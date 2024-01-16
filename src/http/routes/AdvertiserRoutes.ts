import { Router } from 'express'
import { ApplyUseCase } from '../middlewares/ApllyUseCases'
import MainAdvertiserUsecases from '../../app/usecases/advertiser/MainAdvertiserUsecases'
const router = Router()

const mainAdvertiser = new MainAdvertiserUsecases()

router.post('/create-advertiser', ApplyUseCase(mainAdvertiser.CreateAdvertiser))//testado
router.get('/find', ApplyUseCase(mainAdvertiser.FindAdvertiser))//testado
router.get('/find-by-email', ApplyUseCase(mainAdvertiser.FindAdvertiserByEmail))//testado
router.patch('/update', ApplyUseCase(mainAdvertiser.UpdateAdvertiser))//testado
router.delete('/delete', ApplyUseCase(mainAdvertiser.DeleteAdvertiser))//testado

router.post("/login",ApplyUseCase(mainAdvertiser.LoginAdvertiser))//testado


// router.post("/upload-cover-post", uploadFile.single('cover-blog-post'), (req, res) => { //testado

//     ApplyUseCase(res, mainBlog.FirebaseUploadCoverPost, req.query, undefined, undefined, req.file)

// })

// router.delete("/delete-profile-img", (req, res) => { //testado

//     ApplyUseCase(res, mainBlog.FirebaseDeleteCoverPost, req.query)

// })


export default router;