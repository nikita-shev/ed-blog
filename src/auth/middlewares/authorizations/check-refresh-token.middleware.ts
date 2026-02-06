import { NextFunction, Request, Response } from 'express';
import { jwtService } from '../../../core/application/jwt.service';
import { authService } from '../../application/auth.service';
import { resultCodeToHttpException } from '../../../core/result-object/utils/resultCodeToHttpException';

export async function checkRefreshTokenMiddleware(req: Request, res: Response, next: NextFunction) {
    const token: string = req.cookies.refreshToken;

    const tokenVerificationResult = jwtService.checkToken(token);
    if (!tokenVerificationResult.data) {
        return res.sendStatus(resultCodeToHttpException(tokenVerificationResult.status));
    }

    const tokenSearchResult = await authService.findSession(token);
    if (!tokenSearchResult.data) {
        return res.sendStatus(resultCodeToHttpException(tokenSearchResult.status));
    }

    req.appContext = { userId: tokenVerificationResult.data.userId };

    next();
}
