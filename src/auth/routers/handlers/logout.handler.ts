import { Request, Response } from 'express';
import { authService } from '../../application/auth.service';
import { resultCodeToHttpException } from '../../../core/result-object/utils/resultCodeToHttpException';

export async function logoutHandler(req: Request, res: Response) {
    const result = await authService.addRefreshTokenToBlackList(req.cookies.refreshToken);
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
