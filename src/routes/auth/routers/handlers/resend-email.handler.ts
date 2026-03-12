import { Request, Response } from 'express';
import { authService } from '../../application/auth.service';
import { resultCodeToHttpException } from '../../../../core/utils/result-object/utils/resultCodeToHttpException';

export async function resendEmailHandler(req: Request<{}, {}, { email: string }>, res: Response) {
    const result = await authService.resendEmail(req.body.email);
    const status = resultCodeToHttpException(result.status);

    if (!result.data) {
        return res.status(status).send({ errorsMessages: result.extensions });
    }

    res.sendStatus(status);
}
