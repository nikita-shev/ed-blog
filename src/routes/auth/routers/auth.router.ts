import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { authInputDtoValidation } from '../middlewares/validation/input-dto-validation';
import {
    authBearerMiddleware,
    authRateLimitReedMiddleware,
    authRateLimitWriteMiddleware
} from '../../../core/middlewares/auth.middleware';
import { userInputDtoValidation } from '../../users/middlewares/validation/input-dto-validation';
import { emailValidation } from '../../users/middlewares/validation/input-dto-validation/modules/email.validation';
import { checkRefreshTokenMiddleware } from '../middlewares/authorizations/check-refresh-token.middleware';
import { newPasswordValidation } from '../middlewares/validation/input-dto-validation/fields/password.validation';
import { recoveryCodeValidation } from '../middlewares/validation/input-dto-validation/fields/recoveryCode.validation';
import { container } from '../../../composition-root';
import { AuthController } from '../controller/auth.controller';

export const authRouter = Router();
const authController = container.get(AuthController);

authRouter
    .get('/me',
         authBearerMiddleware, authController.getInfoAboutUser.bind(authController))
    .post(
        '/login',
        authRateLimitReedMiddleware,
        authRateLimitWriteMiddleware,
        authInputDtoValidation,
        inputValidationResultMiddleware,
        authController.checkUser.bind(authController)
    )
    .post(
        '/registration',
        authRateLimitReedMiddleware,
        authRateLimitWriteMiddleware,
        userInputDtoValidation,
        inputValidationResultMiddleware,
        authController.registrationUser.bind(authController)
    ) // TODO: userInputDtoValidation в authRouter?
    .post(
        '/registration-confirmation',
        authRateLimitReedMiddleware,
        authRateLimitWriteMiddleware,
        authController.confirmRegistration.bind(authController)
    )
    .post(
        '/registration-email-resending',
        authRateLimitReedMiddleware,
        authRateLimitWriteMiddleware,
        emailValidation,
        inputValidationResultMiddleware,
        authController.resendEmail.bind(authController)
    )
    .post(
        '/refresh-token',
        checkRefreshTokenMiddleware,
        authController.replaceRefreshToken.bind(authController)
    )
    .post('/logout', checkRefreshTokenMiddleware, authController.logout.bind(authController))
    .post(
        '/password-recovery',
        authRateLimitReedMiddleware,
        authRateLimitWriteMiddleware,
        emailValidation,
        inputValidationResultMiddleware,
        authController.passwordRecovery.bind(authController)
    )
    .post(
        '/new-password',
        authRateLimitReedMiddleware,
        authRateLimitWriteMiddleware,
        newPasswordValidation,
        recoveryCodeValidation,
        inputValidationResultMiddleware,
        authController.createNewPassword.bind(authController)
    ); // TODO: newPasswordValidation + recoveryCodeValidation - merge into validation array

// TODO: "path" -> enum
