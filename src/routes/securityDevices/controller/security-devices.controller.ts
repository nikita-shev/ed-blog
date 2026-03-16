import { SecurityDevicesService } from '../application/security-devices.service';
import { Request, Response } from 'express';
import { DevicesOutputDto } from '../dto/devices.dto';
import { resultCodeToHttpException } from '../../../core/utils/result-object/utils/resultCodeToHttpException';

export class SecurityDevicesController {
    constructor(private securityDevicesService: SecurityDevicesService) {}

    async getDevices(req: Request, res: Response<DevicesOutputDto[]>) {
        const result = await this.securityDevicesService.getActiveDevices(req.cookies.refreshToken);
        const status = resultCodeToHttpException(result.status);

        res.status(status).send(result.data);
    }

    async terminateAllThirdPartySessions(req: Request, res: Response) {
        const result = await this.securityDevicesService.terminateAllThirdPartySessions(
            req.cookies.refreshToken // TODO: описать global.d.ts для cookies
        );
        const status = resultCodeToHttpException(result.status);

        res.sendStatus(status);
    }

    async terminateSpecifiedDeviceSession(req: Request<{ id: string }>, res: Response) {
        const result = await this.securityDevicesService.terminateSpecifiedDeviceSession(
            req.cookies.refreshToken,
            req.params.id
        );
        const status = resultCodeToHttpException(result.status);

        res.sendStatus(status);
    }
}
