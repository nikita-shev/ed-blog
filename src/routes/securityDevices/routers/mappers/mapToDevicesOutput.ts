import { SessionWithId } from '../../../../auth/types/sessions.types';
import { DevicesOutputDto } from '../../dto/devices.dto';

export const mapToDevicesOutput = (data: SessionWithId[]): DevicesOutputDto[] => {
    return data.map((el) => ({
        ip: el.ip,
        title: el.device,
        deviceId: el.deviceId,
        lastActiveDate: el.iat
    }));
};
