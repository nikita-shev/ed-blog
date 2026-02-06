import { RefreshToken } from '../dto/auth.dto';
import { blackListCollection, sessionsCollection } from '../../db/db.config';
import { UserSessionData } from '../types/sessions.types';
import { RefreshTokenPayload } from '../application/auth.service';

// TODO: вынести работу с черным списком в отдельный сервис/репозиторий
export const authRepository = {
    async addUserSession(data: UserSessionData): Promise<boolean> {
        const result = await sessionsCollection.insertOne(data);

        return Boolean(result.insertedId);
    },

    async findSession(data: UserSessionData): Promise<boolean> {
        const result = await sessionsCollection.findOne({
            userId: data.userId,
            deviceId: data.deviceId,
            iat: new Date(data.iat).toISOString()
        });

        return Boolean(result);
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
