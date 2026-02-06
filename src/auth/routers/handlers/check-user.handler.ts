import { Request, Response } from 'express';
import { add } from 'date-fns';
import { authService } from '../../application/auth.service';
import { resultCodeToHttpException } from '../../../core/result-object/utils/resultCodeToHttpException';
import { PATHS } from '../../../core/constants/paths';
import { AuthInputDto, TokenOutputDto } from '../../dto/auth.dto';

export async function checkUserHandler(
    req: Request<{}, {}, AuthInputDto>,
    res: Response<TokenOutputDto>
) {
    const serviceInfo = { device: req.get('User-agent') };
    const result = await authService.checkUser(req.body, serviceInfo);
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
