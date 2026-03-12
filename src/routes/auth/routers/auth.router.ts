import { Request, Response, Router } from 'express';
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
import { AuthService } from '../application/auth.service';
import { AuthInputDto, AuthOutputDto, RegistrationInputDto, TokenOutputDto } from '../dto/auth.dto';
import { ServiceInfo } from '../types/auth.types';
import { resultCodeToHttpException } from '../../../core/utils/result-object/utils/resultCodeToHttpException';
import { add } from 'date-fns';
import { PATHS } from '../../../core/constants/paths';
import { authController } from '../../../composition-root';

export const authRouter = Router();

export class AuthController {
    constructor(private authService: AuthService) {}

    async checkUser(req: Request<{}, {}, AuthInputDto>, res: Response<TokenOutputDto>) {
        const serviceInfo: ServiceInfo = { device: req.get('User-agent'), ip: req.ip };
        const result = await this.authService.checkUser(req.body, serviceInfo);
        const status = resultCodeToHttpException(result.status);

        if (!result.data) {
            return res.sendStatus(status);
        }

        // TODO: move to utils
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            expires: add(new Date(), { days: 1 })
        };
        res.cookie('refreshToken', result.data.refreshToken, {
            ...cookieOptions,
            path: `${PATHS.auth}/refresh-token` // TODO: fix /refresh-token
        });
        res.cookie('refreshToken', result.data.refreshToken, {
            ...cookieOptions,
            path: `${PATHS.auth}/logout` // TODO: fix /logout
        });

        res.status(status).send({ accessToken: result.data.accessToken });
    }

    async confirmRegistration(req: Request<{}, {}, { code: string }>, res: Response) {
        const result = await this.authService.confirmRegistrationUser(req.body.code);
        const status = resultCodeToHttpException(result.status);

        if (!result.data) {
            return res.status(status).send({ errorsMessages: result.extensions });
        }

        res.sendStatus(status);
    }

    async getInfoAboutUser(req: Request, res: Response<AuthOutputDto>) {
        const result = await this.authService.getInfoAboutUser(req.appContext?.userId as string);
        const status = resultCodeToHttpException(result.status);

        if (!result.data) {
            return res.sendStatus(status);
        }

        res.status(status).send(result.data);
    }

    async logout(req: Request, res: Response) {
        const result = await this.authService.deleteSession(req.cookies.refreshToken);
        const status = resultCodeToHttpException(result.status);

        if (!result.data) {
            return res.sendStatus(status);
        }

        res.cookie('refreshToken', '', {
            httpOnly: true,
            secure: true,
            maxAge: -1,
            path: '/'
        });
        res.sendStatus(status);
    }

    async registrationUser(req: Request<{}, {}, RegistrationInputDto>, res: Response) {
        const result = await this.authService.registrationUser(req.body);
        const status = resultCodeToHttpException(result.status);

        if (!result.data) {
            return res.status(status).send({ errorsMessages: result.extensions });
        }

        res.sendStatus(status);
    }

    async replaceRefreshToken(req: Request, res: Response<TokenOutputDto>) {
        const userId = req.appContext.userId as string;
        // TODO: типизация для req.cookies.refreshToken. как?
        const result = await this.authService.replaceRefreshToken(userId, req.cookies.refreshToken);
        const status = resultCodeToHttpException(result.status);

        if (!result.data) {
            return res.sendStatus(status);
        }

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            expires: add(new Date(), { days: 1 })
        };
        res.cookie('refreshToken', result.data.refreshToken, {
            ...cookieOptions,
            path: `${PATHS.auth}/refresh-token` // TODO: fix /refresh-token
        });
        res.cookie('refreshToken', result.data.refreshToken, {
            ...cookieOptions,
            path: `${PATHS.auth}/logout` // TODO: fix /logout
        });
        res.cookie('refreshToken', result.data.refreshToken, {
            ...cookieOptions,
            path: `${PATHS.securityDevices}` // TODO: fix
        });

        res.status(status).send({ accessToken: result.data.accessToken });
    }

    async resendEmail(req: Request<{}, {}, { email: string }>, res: Response) {
        const result = await this.authService.resendEmail(req.body.email);
        const status = resultCodeToHttpException(result.status);

        if (!result.data) {
            return res.status(status).send({ errorsMessages: result.extensions });
        }

        res.sendStatus(status);
    }
}

authRouter
    .get('/me', authBearerMiddleware, authController.getInfoAboutUser.bind(authController))
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
    ) // TODO: так можно (userInputDtoValidation в authRouter)?
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
    .post('/logout', checkRefreshTokenMiddleware, authController.logout.bind(authController));

// TODO: вынести "path" в enam
