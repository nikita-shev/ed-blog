import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { authInputDtoValidation } from '../middlewares/validation/input-dto-validation';
import { checkUserHandler } from './handlers/check-user.handler';
import {
    authBearerMiddleware,
    authRateLimitReedMiddleware,
    authRateLimitWriteMiddleware
} from '../../../core/middlewares/auth.middleware';
import { getInfoAboutUserHandler } from './handlers/get-info-about-user.handler';
import { userInputDtoValidation } from '../../users/middlewares/validation/input-dto-validation';
import { registrationUserHandler } from './handlers/registration-user.handler';
import { confirmRegistrationHandler } from './handlers/confirm-registration.handler';
import { emailValidation } from '../../users/middlewares/validation/input-dto-validation/modules/email.validation';
import { resendEmailHandler } from './handlers/resend-email.handler';
import { replaceRefreshTokenHandler } from './handlers/replace-refresh-token.handler';
import { checkRefreshTokenMiddleware } from '../middlewares/authorizations/check-refresh-token.middleware';
import { logoutHandler } from './handlers/logout.handler';

export const authRouter = Router();

authRouter
    .get('/me', authBearerMiddleware, getInfoAboutUserHandler)
    .post(
        '/login',
        authRateLimitReedMiddleware,
        authRateLimitWriteMiddleware,
        authInputDtoValidation,
        inputValidationResultMiddleware,
        checkUserHandler
    )
    .post(
        '/registration',
        authRateLimitReedMiddleware,
        authRateLimitWriteMiddleware,
        userInputDtoValidation,
        inputValidationResultMiddleware,
        registrationUserHandler
    ) // TODO: так можно (userInputDtoValidation в authRouter)?
    .post(
        '/registration-confirmation',
        authRateLimitReedMiddleware,
        authRateLimitWriteMiddleware,
        confirmRegistrationHandler
    )
    .post(
        '/registration-email-resending',
        authRateLimitReedMiddleware,
        authRateLimitWriteMiddleware,
        emailValidation,
        inputValidationResultMiddleware,
        resendEmailHandler
    )
    .post('/refresh-token', checkRefreshTokenMiddleware, replaceRefreshTokenHandler)
    .post('/logout', checkRefreshTokenMiddleware, logoutHandler);

// TODO: вынести "path" в enam
