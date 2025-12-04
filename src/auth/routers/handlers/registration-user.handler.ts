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

    res.sendStatus(status);
}
