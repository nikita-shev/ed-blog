import { inject, injectable } from 'inversify';
import { SessionModel } from '../schema/schema';
import { RefreshTokenPayload } from '../../auth/application/auth.service';
import { SecurityDevicesRepository } from '../repositories/security-devices.repository';
import { jwtService } from '../../../core/application/jwt.service';
import {
    forbiddenResult,
    noContentResult,
    notFoundResult,
    successResult
} from '../../../core/utils/result-object';
import { mapSession, mapToDevicesOutput } from '../routers/mappers/mapToDevicesOutput';
import { ServiceDto } from '../../../core/utils/result-object/types/result-object.types';
import { ISessionForService, IUserSessionData } from '../types/sessions.types';
import { DevicesOutputDto } from '../dto/devices.dto';

@injectable()
export class SecurityDevicesService {
    constructor(
        @inject(SecurityDevicesRepository)
        private securityDevicesRepository: SecurityDevicesRepository
    ) {}

    // TODO: getActiveDevices -> queryRepo ???
    async getActiveDevices(token: string): Promise<ServiceDto<DevicesOutputDto[]>> {
        const { data: payload } = jwtService.decode<Omit<IUserSessionData, 'device' | 'ip'>>(token);
        const result = await this.securityDevicesRepository.findActiveDevices(payload.userId);

        return successResult.create(mapToDevicesOutput(result)); // TODO: Что делать если девайсов нет?
    }

    async terminateAllThirdPartySessions(token: string): Promise<ServiceDto<boolean>> {
        const { data: payload } = jwtService.decode<Omit<IUserSessionData, 'device' | 'ip'>>(token);
        const result = await this.securityDevicesRepository.deleteAllThirdPartySessions(
            payload.userId,
            payload.deviceId
        );

        return noContentResult.create(result);
    }

    async terminateSpecifiedDeviceSession(token: string, deviceId: string): Promise<ServiceDto> {
        const { data: payload } = jwtService.decode<Omit<IUserSessionData, 'device' | 'ip'>>(token);
        const session = await this.securityDevicesRepository.findSessionByDeviceId(deviceId);

        if (!session) return notFoundResult.create();

        const resultOfDeletion =
            await this.securityDevicesRepository.terminateSpecifiedDeviceSession(
                payload.userId,
                deviceId
            );

        return resultOfDeletion ? noContentResult.create() : forbiddenResult.create();

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

    async createUserSession(
        refreshToken: string,
        device: string,
        userIp: string
    ): Promise<ServiceDto<boolean>> {
        const payload = jwtService.decode<RefreshTokenPayload>(refreshToken);
        const { deviceId, userId, iat, exp } = payload.data;

        const userSession = new SessionModel({
            deviceId,
            userId,
            device,
            ip: userIp,
            iat: new Date(iat).toISOString(),
            exp: new Date(exp).toISOString()
        });
        await this.securityDevicesRepository.save(userSession);

        return successResult.create(true);
    }

    async getSessionByDevice(
        userId: string,
        device: string,
        ip: string
    ): Promise<ServiceDto<ISessionForService | null>> {
        const session = await this.securityDevicesRepository.findSessionByDevice(
            userId,
            device,
            ip
        );

        if (!session) return notFoundResult.create();

        return successResult.create(mapSession(session));
    }

    async getSessionByFilter(
        filter: Partial<IUserSessionData>
    ): Promise<ServiceDto<ISessionForService | null>> {
        const session = await this.securityDevicesRepository.findSessionByFilter(filter);

        if (!session) return notFoundResult.create();

        return successResult.create(mapSession(session));
    }

    async deleteSession(deviceId: string): Promise<ServiceDto<boolean | null>> {
        const result = await this.securityDevicesRepository.deleteSession(deviceId);

        return result ? successResult.create(true) : notFoundResult.create();
    }

    async replaceUserSession(refreshToken: string): Promise<ServiceDto<boolean | null>> {
        const { data: payload } = jwtService.decode<RefreshTokenPayload>(refreshToken);
        const session = await this.securityDevicesRepository.findSessionByFilter({
            userId: payload.userId,
            deviceId: payload.deviceId
        });

        if (!session) return notFoundResult.create();

        session.iat = new Date(payload.iat).toISOString();
        session.exp = new Date(payload.exp).toISOString();
        await this.securityDevicesRepository.save(session);

        return successResult.create(true);
    }
}

// TODO: <Omit<UserSessionData, 'device' | 'ip'>> -> в отдельный тип
