import { Request, Response } from 'express';
import { AuthOutputDto } from '../../dto/auth.dto';
import { authService } from '../../application/auth.service';
import { resultCodeToHttpException } from '../../../../core/utils/result-object/utils/resultCodeToHttpException';

export async function getInfoAboutUserHandler(req: Request, res: Response<AuthOutputDto>) {
    const result = await authService.getInfoAboutUser(req.appContext?.userId as string);
    const status = resultCodeToHttpException(result.status);

    if (!result.data) {
        return res.sendStatus(status);
    }

    res.status(status).send(result.data);
}
