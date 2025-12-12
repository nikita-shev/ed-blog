import { RefreshToken } from '../dto/auth.dto';
import { blackListCollection } from '../../db/db.config';

export const authRepository = {
    async checkToken(token: RefreshToken): Promise<boolean> {
        const result = await blackListCollection.findOne({ refreshToken: token });

        return !Boolean(result);
    },

    async addRefreshTokenToBlackList(token: RefreshToken): Promise<boolean> {
        const result = await blackListCollection.insertOne({ refreshToken: token });

        return Boolean(result.insertedId); // TODO: нужен try{}catch при работе с БД?
    }
};
