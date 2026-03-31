import { ISessionForService, TSessionWithId } from '../../types/sessions.types';
import { DevicesOutputDto } from '../../dto/devices.dto';

export const mapToDevicesOutput = (data: TSessionWithId[]): DevicesOutputDto[] => {
    return data.map((el) => ({
        ip: el.ip,
        title: el.device,
        deviceId: el.deviceId,
        lastActiveDate: el.iat
    }));
};

// TODO: (support) TSessionWithId -> SessionDocument. Проблема с типами.
export const mapSession = (data: TSessionWithId): ISessionForService => {
    return {
        device: data.device,
        deviceId: data.deviceId,
        userId: data.userId,
        ip: data.ip,
        iat: data.iat,
        exp: data.exp
    };
};
