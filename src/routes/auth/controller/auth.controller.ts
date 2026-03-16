import { AuthService } from '../application/auth.service';
import { Request, Response } from 'express';
import { AuthInputDto, AuthOutputDto, RegistrationInputDto, TokenOutputDto } from '../dto/auth.dto';
import { ServiceInfo } from '../types/auth.types';
import { resultCodeToHttpException } from '../../../core/utils/result-object/utils/resultCodeToHttpException';
import { add } from 'date-fns';
import { PATHS } from '../../../core/constants/paths';

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

    async passwordRecovery(req: Request<{}, {}, { email: string }>, res: Response) {
        const result = await this.authService.passwordRecovery(req.body.email);
        const status = resultCodeToHttpException(result.status);

        res.sendStatus(status);
    }

    async createNewPassword(
        req: Request<{}, {}, { newPassword: string; recoveryCode: string }>,
        res: Response
    ) {
        const result = await this.authService.createNewPassword(
            req.body.newPassword,
            req.body.recoveryCode
        );
        const status = resultCodeToHttpException(result.status);

        res.sendStatus(status);
    }
}
