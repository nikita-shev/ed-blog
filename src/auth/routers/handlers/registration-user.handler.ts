import { Request, Response } from 'express';
import { RegistrationInputDto } from '../../dto/auth.dto';
import { authService } from '../../application/auth.service';
import { resultCodeToHttpException } from '../../../core/result-object/utils/resultCodeToHttpException';

export async function registrationUserHandler(
    req: Request<{}, {}, RegistrationInputDto>,
    res: Response
) {
    const result = await authService.registrationUser(req.body);
    const status = resultCodeToHttpException(result.status);

    return res.sendStatus(429); // TODO: временно, вернуть коммент ниже

    // if (!result.data) {
    //     return res.status(status).send({ errorsMessages: result.extensions });
    // }
    //
    // res.sendStatus(status);
}
