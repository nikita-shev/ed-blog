import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { authInputDtoValidation } from '../middlewares/validation/input-dto-validation';
import { checkUserHandler } from './handlers/check-user.handler';

export const authRouter = Router();

authRouter.post(
    '/login',
    authInputDtoValidation,
    inputValidationResultMiddleware,
    checkUserHandler
);
