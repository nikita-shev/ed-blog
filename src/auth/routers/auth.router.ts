import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { authInputDtoValidation } from '../middlewares/validation/input-dto-validation';
import { checkUserHandler } from './handlers/check-user.handler';
import { authBearerMiddleware } from '../../core/middlewares/auth.middleware';
import { getInfoAboutUserHandler } from './handlers/get-info-about-user.handler';
import { userInputDtoValidation } from '../../users/middlewares/validation/input-dto-validation';
import { registrationUserHandler } from './handlers/registration-user.handler';

export const authRouter = Router();

authRouter
    .get('/me', authBearerMiddleware, getInfoAboutUserHandler)
    .post('/login', authInputDtoValidation, inputValidationResultMiddleware, checkUserHandler)
    .post(
        '/registration',
        userInputDtoValidation,
        inputValidationResultMiddleware,
        registrationUserHandler
    ); // TODO: так можно (userInputDtoValidation в authRouter)?
