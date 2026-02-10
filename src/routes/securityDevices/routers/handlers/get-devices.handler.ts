import { Request, Response } from 'express';
import { securityDevicesService } from '../../application/security-devices.service';
import { resultCodeToHttpException } from '../../../../core/result-object/utils/resultCodeToHttpException';
import { DevicesOutputDto } from '../../dto/devices.dto';

export async function getDevicesHandler(req: Request, res: Response<DevicesOutputDto[]>) {
    const result = await securityDevicesService.getActiveDevices(req.cookies.refreshToken);
    const status = resultCodeToHttpException(result.status);

    res.status(status).send(result.data);
}
