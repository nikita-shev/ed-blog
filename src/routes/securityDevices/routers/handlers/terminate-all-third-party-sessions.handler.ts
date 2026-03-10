import { Request, Response } from 'express';
import { securityDevicesService } from '../../application/security-devices.service';
import { resultCodeToHttpException } from '../../../../core/utils/result-object/utils/resultCodeToHttpException';

// TODO: rename
export async function terminateAllThirdPartySessionsHandler(req: Request, res: Response) {
    const result = await securityDevicesService.terminateAllThirdPartySessions(
        req.cookies.refreshToken // TODO: описать global.d.ts для cookies
    );
    const status = resultCodeToHttpException(result.status);

    res.sendStatus(status);
}
