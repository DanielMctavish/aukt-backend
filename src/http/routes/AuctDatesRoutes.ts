import { Router } from 'express';
import { ApplyUseCase } from '../middlewares/ApllyUseCases';
import MainGroupDatesUsecases from '../../app/usecases/groupDates/MainGroupDatesUsecases';
import { verifyToken } from '../../authentication/JWT';

const router = Router();
const mainGroupDates = new MainGroupDatesUsecases();

// Rota para mudar o status do grupo de datas
router.patch('/change-group-dates-status', verifyToken, ApplyUseCase(mainGroupDates.ChangeGroupDatesStatus));

export default router;
