import { Router } from 'express'
import { ApplyUseCase } from '../middlewares/ApllyUseCases'
import MainTransactionsUsecases from '../../app/usecases/transactions/MainTransactionsUsecases'
import { verifyToken } from '../../authentication/JWT'

const router = Router()
const prismaTransaction = new MainTransactionsUsecases()

router.post("/create-transaction", verifyToken, ApplyUseCase(prismaTransaction.CreateTransaction))
router.get("/find-transaction", verifyToken, ApplyUseCase(prismaTransaction.FindTransaction))
router.get("/list-transaction", verifyToken, ApplyUseCase(prismaTransaction.ListTransactions))
router.patch("/updated-transaction", verifyToken, ApplyUseCase(prismaTransaction.UpdateTransaction))
router.delete("/delete-transaction", verifyToken, ApplyUseCase(prismaTransaction.DeleteTransaction))

export default router;