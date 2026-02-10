import { Request, Response } from 'express';
import { authService } from '../../application/auth.service';
import { resultCodeToHttpException } from '../../../core/result-object/utils/resultCodeToHttpException';

export async function resendEmailHandler(
    req: Request<{}, {}, { email: 'example@example.com' }>,
    res: Response
) {
    const result = await authService.resendEmail(req.body.email);
    const status = resultCodeToHttpException(result.status);

    return res.sendStatus(429); // TODO: временно, вернуть коммент ниже

    // if (!result.data) {
    //     return res.status(status).send({ errorsMessages: result.extensions });
    // }
    //
    // res.sendStatus(status);
}
