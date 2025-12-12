import { Request, Response } from 'express';
import { authService } from '../../application/auth.service';
import { AccessToken, AuthInputDto } from '../../dto/auth.dto';
import { resultCodeToHttpException } from '../../../core/result-object/utils/resultCodeToHttpException';

export async function checkUserHandler(
    req: Request<{}, {}, AuthInputDto>,
    res: Response<AccessToken>
) {
    const result = await authService.checkUser(req.body);
    const status = resultCodeToHttpException(result.status);

    if (!result.data) {
        return res.sendStatus(status);
    }

    res.cookie('refreshToken', result.data.refreshToken, { httpOnly: true, secure: true });
    res.status(status).send(result.data.accessToken);
}
