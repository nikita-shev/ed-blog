import { injectable } from 'inversify';
import { SessionWithId } from '../../auth/types/sessions.types';
import { sessionsCollection } from '../../../db/db.config';

@injectable()
export class SecurityDevicesRepository {
    // TODO: findActiveDevices -> queryRepo ???
    async findActiveDevices(userId: string): Promise<SessionWithId[]> {
        return await sessionsCollection.find({ userId }).toArray();
    }

    async terminateAllThirdPartySessions(userId: string, deviceId: string): Promise<boolean> {
        const result = await sessionsCollection.deleteMany({ $nor: [{ userId, deviceId }] });

        return result.deletedCount === 1;
    }

    async terminateSpecifiedDeviceSession(userId: string, deviceId: string): Promise<boolean> {
        const result = await sessionsCollection.deleteOne({ userId, deviceId });

        return result.deletedCount === 1;
    }
}
