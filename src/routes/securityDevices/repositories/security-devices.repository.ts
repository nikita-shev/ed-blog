import { injectable } from 'inversify';
import { SessionDocument, SessionModel } from '../schema/schema';
import { IUserSessionData, TSessionWithId } from '../types/sessions.types';

@injectable()
export class SecurityDevicesRepository {
    async save(document: SessionDocument): Promise<void> {
        await document.save();
    }

    // TODO: findActiveDevices -> queryRepo ???
    async findActiveDevices(userId: string): Promise<TSessionWithId[]> {
        return SessionModel.find({ userId }).lean();
    }

    async deleteAllThirdPartySessions(userId: string, deviceId: string): Promise<boolean> {
        const result = await SessionModel.deleteMany({ $nor: [{ userId, deviceId }] });

        return result.deletedCount === 1;
    }

    async terminateSpecifiedDeviceSession(userId: string, deviceId: string): Promise<boolean> {
        const result = await SessionModel.deleteOne({ userId, deviceId });

        return result.deletedCount === 1;
    }

    async findSessionByDeviceId(deviceId: string): Promise<SessionDocument | null> {
        // return await sessionsCollection.findOne({ userId, deviceId });
        return SessionModel.findOne({ deviceId });
    }

    async findSessionByDevice(
        userId: string,
        device: string,
        ip: string
    ): Promise<SessionDocument | null> {
        return SessionModel.findOne({ userId, device, ip });
    }

    async findSessionByFilter(filter: Partial<IUserSessionData>): Promise<SessionDocument | null> {
        return SessionModel.findOne(filter);
    }

    async deleteSession(deviceId: string): Promise<boolean> {
        const result = await SessionModel.deleteOne({ deviceId });

        return result.deletedCount === 1;
    }
}
