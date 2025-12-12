import { Request, Response } from 'express';
import { add } from 'date-fns';
import { authService } from '../../application/auth.service';
import { resultCodeToHttpException } from '../../../core/result-object/utils/resultCodeToHttpException';
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

    res.cookie('refreshToken', result.data.refreshToken, {
        httpOnly: true,
        secure: true,
        expires: add(new Date(), { days: 1 }),
        path: `${PATHS.auth}/refresh-token` // TODO: fix /refresh-token
    });
    res.status(status).send({ accessToken: result.data.accessToken });
}
