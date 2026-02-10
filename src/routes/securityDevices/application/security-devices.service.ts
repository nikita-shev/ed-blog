import { ResultObject, ResultStatus } from '../../../core/result-object/result-object.types';
import { jwtService } from '../../../core/application/jwt.service';
import { UserSessionData } from '../../../auth/types/sessions.types';
import { securityDevicesRepository } from '../repositories/security-devices.repository';
import { createResultObject } from '../../../core/result-object/utils/createResultObject';
import { DevicesOutputDto } from '../dto/devices.dto';
import { mapToDevicesOutput } from '../routers/mappers/mapToDevicesOutput';
import { authRepository } from '../../../auth/repositories/auth.repository';

class SecurityDevicesService {
    // TODO: getActiveDevices -> queryRepo ???
    async getActiveDevices(token: string): Promise<ResultObject<DevicesOutputDto[]>> {
        const { data: payload } = jwtService.decode<Omit<UserSessionData, 'device' | 'ip'>>(token);
        const result = await securityDevicesRepository.findActiveDevices(payload.userId);

        return createResultObject(mapToDevicesOutput(result)); // TODO: Что делать если девайсов нет?
    }

    async terminateAllThirdPartySessions(token: string): Promise<ResultObject<boolean>> {
        const { data: payload } = jwtService.decode<Omit<UserSessionData, 'device' | 'ip'>>(token);
        const result = await securityDevicesRepository.terminateAllThirdPartySessions(
            payload.userId,
            payload.deviceId
        );

        return createResultObject(result, ResultStatus.NoContent);
    }

    async terminateSpecifiedDeviceSession(token: string, deviceId: string): Promise<ResultObject> {
        const { data: payload } = jwtService.decode<Omit<UserSessionData, 'device' | 'ip'>>(token);

        const foundSession = await authRepository.findSessionByDeviceId(deviceId);
        if (!foundSession) return createResultObject(null, ResultStatus.NotFound);

        const deletedResult = await securityDevicesRepository.terminateSpecifiedDeviceSession(
            payload.userId,
            deviceId
        );

        return createResultObject(
            null,
            deletedResult ? ResultStatus.NoContent : ResultStatus.Forbidden
        );

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

export const securityDevicesService = new SecurityDevicesService(); // TODO: перенести в отдельный файл

// TODO: <Omit<UserSessionData, 'device' | 'ip'>> -> в отдельный тип
