import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { authInputDtoValidation } from '../middlewares/validation/input-dto-validation';
import { checkUserHandler } from './handlers/check-user.handler';
import { authBearerMiddleware } from '../../core/middlewares/auth.middleware';
import { getInfoAboutUserHandler } from './handlers/get-info-about-user.handler';

export const authRouter = Router();

authRouter
    .get('/me', authBearerMiddleware, getInfoAboutUserHandler)
    // .post('/login', authInputDtoValidation, inputValidationResultMiddleware, checkUserHandler);
    .post('/login', checkUserHandler);
