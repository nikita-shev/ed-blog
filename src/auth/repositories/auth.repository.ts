import { sessionsCollection } from '../../db/db.config';
import { SessionWithId, UserSessionData } from '../types/sessions.types';
import { RefreshTokenPayload } from '../application/auth.service';

// TODO: вынести работу с черным списком в отдельный сервис/репозиторий
export const authRepository = {
    async addUserSession(data: UserSessionData): Promise<boolean> {
        const result = await sessionsCollection.insertOne(data);

        return Boolean(result.insertedId);
    },

    // TODO: сделать сервис и заменить во всех местах
    async findSessionByDevice(
        userId: string,
        device: string,
        ip: string
    ): Promise<SessionWithId | null> {
        return await sessionsCollection.findOne({ userId, device, ip });
    },

    // TODO: сделать сервис и заменить во всех местах
    async findSessionByDeviceId(deviceId: string): Promise<SessionWithId | null> {
        // return await sessionsCollection.findOne({ userId, deviceId });

        return await sessionsCollection.findOne({ deviceId });
    },

    // TODO: rename -> findSessionByToken
    async findSession(data: UserSessionData): Promise<SessionWithId | null> {
        return await sessionsCollection.findOne({
            userId: data.userId,
            deviceId: data.deviceId,
            iat: new Date(data.iat).toISOString()
        });
    },

    async replaceUserSession(data: RefreshTokenPayload): Promise<boolean> {
        const result = await sessionsCollection.updateOne(
            {
                userId: data.userId,
                deviceId: data.deviceId
            },
            { $set: { iat: data.iat, exp: data.exp } }
        );

        return result.matchedCount === 1;
    },

    async deleteSession(deviceId: string): Promise<boolean> {
        const result = await sessionsCollection.deleteOne({ deviceId });

        return result.deletedCount === 1; // TODO: нужен try{}catch при работе с БД?
    }
};
