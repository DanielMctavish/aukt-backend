import { Router } from 'express'
import { ApplyUseCase } from '../middlewares/ApllyUseCases'
import MainCartelaUsecases from '../../app/usecases/cartela/MainCartelaUsecases'
import { verifyToken } from '../../authentication/JWT'

const router = Router()
const prismaMainCartela = new MainCartelaUsecases()

//cartela

router.post("/create-cartela", verifyToken, ApplyUseCase(prismaMainCartela.CreateCartela))
router.get("/find-cartela", verifyToken, ApplyUseCase(prismaMainCartela.FindCartela))
router.get("/list-cartelas", verifyToken, ApplyUseCase(prismaMainCartela.ListCartela))
router.get("/list-cartelas-by-client", verifyToken, ApplyUseCase(prismaMainCartela.ListCartelaByClient))
router.patch("/update-cartela", verifyToken, ApplyUseCase(prismaMainCartela.UpdateCartela))
router.delete("/delete-cartela", verifyToken, ApplyUseCase(prismaMainCartela.DeleteCartela))

export default router;