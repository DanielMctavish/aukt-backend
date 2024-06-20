import { Router } from 'express'
import multer from 'multer'
import { ApplyUseCase } from '../middlewares/ApllyUseCases'
import MainAuctUsecases from '../../app/usecases/auct/MainAuctUsecases'
import { verifyToken } from '../../authentication/JWT'
import { cronmarker } from '../../auk-cron-bot/AukCronBot'
import { IAuct } from '../../app/entities/IAuct'

const router = Router()
const upload = multer()

const mainAuct = new MainAuctUsecases()

router.post('/create-auct', verifyToken, ApplyUseCase(mainAuct.CreateAuct))//testado
router.get('/find-auct', ApplyUseCase(mainAuct.FindAuct))//testado
router.get('/find-by-nanoid', verifyToken, ApplyUseCase(mainAuct.FindAuctByNanoId))//
router.get('/list-auct', ApplyUseCase(mainAuct.ListAuct))//testado
router.patch('/update-auct', verifyToken, ApplyUseCase(mainAuct.UpdateAuct))//testado
router.delete('/delete-auct', verifyToken, ApplyUseCase(mainAuct.DeleteAuct))//testado

router.post('/upload-cover-auct', upload.single("cover-auct-image"), ApplyUseCase(mainAuct.FirebaseUploadCoverAuct))
router.delete('/delete-cover-auct', ApplyUseCase(mainAuct.FirebaseDeleteCoverAuct))


//ControllerAuct.......................................................................
router.post('/start-auct', (req, res) => {

    if (!req.query.auct_id || !req.query.group) {
        return res.status(400).json({
            message: 'Aukt Auction ID and Group is required',
        })
    }

    cronmarker.startAuction(req.query.auct_id, req.query.group).then((response) => {

        res.status(response.status).json({ message: response.message })

    }).catch((err) => {
        res.status(err.status).json({ message: err.message })
    })

})

router.post('/pause-product-time', (req, res) => {

    cronmarker.pauseAuction(req.query.auct_id).then(response => {
        res.status(response.status).json({ message: response.message })
    })

})

router.post('/resume-floor', (req, res) => {

    cronmarker.resumeAuction(req.query.auct_id).then(response => {
        res.status(response.status).json({ message: response.message })
    })

})

router.post('/change-product-time', (req, res) => {

})


export default router;