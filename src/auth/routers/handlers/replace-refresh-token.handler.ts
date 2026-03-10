import { Request, Response } from 'express';
import { add } from 'date-fns';
import { authService } from '../../application/auth.service';
import { resultCodeToHttpException } from '../../../core/utils/result-object/utils/resultCodeToHttpException';
import { PATHS } from '../../../core/constants/paths';
import { TokenOutputDto } from '../../dto/auth.dto';

export async function replaceRefreshTokenHandler(req: Request, res: Response<TokenOutputDto>) {
    const userId = req.appContext.userId as string;
    // TODO: типизация для req.cookies.refreshToken. как?
    const result = await authService.replaceRefreshToken(userId, req.cookies.refreshToken);
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
