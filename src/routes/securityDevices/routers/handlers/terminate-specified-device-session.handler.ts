import { Request, Response } from 'express';
import { securityDevicesService } from '../../application/security-devices.service';
import { resultCodeToHttpException } from '../../../../core/result-object/utils/resultCodeToHttpException';

// TODO: rename
export async function terminateSpecifiedDeviceSessionHandler(
    req: Request<{ id: string }>,
    res: Response
) {
    const result = await securityDevicesService.terminateSpecifiedDeviceSession(
        req.cookies.refreshToken,
        req.params.id
    );
    const status = resultCodeToHttpException(result.status);

    res.sendStatus(status);
}
