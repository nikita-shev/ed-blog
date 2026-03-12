import { ServiceDto } from '../../../core/utils/result-object/types/result-object.types';
import { jwtService } from '../../../core/application/jwt.service';
import { UserSessionData } from '../../auth/types/sessions.types';
import {
    forbiddenResult,
    noContentResult,
    notFoundResult,
    successResult
} from '../../../core/utils/result-object';
import { DevicesOutputDto } from '../dto/devices.dto';
import { mapToDevicesOutput } from '../routers/mappers/mapToDevicesOutput';
import { authRepository } from '../../auth/repositories/auth.repository';
import { SecurityDevicesRepository } from '../repositories/security-devices.repository';

export class SecurityDevicesService {
    constructor(private securityDevicesRepository: SecurityDevicesRepository) {}

    // TODO: getActiveDevices -> queryRepo ???
    async getActiveDevices(token: string): Promise<ServiceDto<DevicesOutputDto[]>> {
        const { data: payload } = jwtService.decode<Omit<UserSessionData, 'device' | 'ip'>>(token);
        const result = await this.securityDevicesRepository.findActiveDevices(payload.userId);

        // return createResultObject(mapToDevicesOutput(result)); // TODO: Что делать если девайсов нет?
        return successResult.create(mapToDevicesOutput(result)); // TODO: Что делать если девайсов нет?
    }

    async terminateAllThirdPartySessions(token: string): Promise<ServiceDto<boolean>> {
        const { data: payload } = jwtService.decode<Omit<UserSessionData, 'device' | 'ip'>>(token);
        const result = await this.securityDevicesRepository.terminateAllThirdPartySessions(
            payload.userId,
            payload.deviceId
        );

        // return createResultObject(result, ResultStatus.NoContent);
        return noContentResult.create(result);
    }

    async terminateSpecifiedDeviceSession(token: string, deviceId: string): Promise<ServiceDto> {
        const { data: payload } = jwtService.decode<Omit<UserSessionData, 'device' | 'ip'>>(token);

        const foundSession = await authRepository.findSessionByDeviceId(deviceId);
        // if (!foundSession) return createResultObject(null, ResultStatus.NotFound);
        if (!foundSession) return notFoundResult.create();

        const deletedResult = await this.securityDevicesRepository.terminateSpecifiedDeviceSession(
            payload.userId,
            deviceId
        );

        // return createResultObject(
        //     null,
        //     deletedResult ? ResultStatus.NoContent : ResultStatus.Forbidden
        // );
        return deletedResult ? noContentResult.create() : forbiddenResult.create();

        // const foundSession = await authRepository.findSessionByDeviceId(payload.userId, deviceId);
        //
        // if (!foundSession) return createResultObject(null, ResultStatus.Forbidden);
        //
        // const deletedResult = await securityDevicesRepository.terminateSpecifiedDeviceSession(
        //     foundSession.userId,
        //     foundSession.deviceId
        // );
        //
        // return createResultObject(
        //     null,
        //     deletedResult ? ResultStatus.NoContent : ResultStatus.NotFound
        // );
    }
}

// TODO: <Omit<UserSessionData, 'device' | 'ip'>> -> в отдельный тип
