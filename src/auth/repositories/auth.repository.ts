import { RefreshToken } from '../dto/auth.dto';
import { blackListCollection } from '../../db/db.config';

// TODO: вынести работу с черным списком в отдельный сервис/репозиторий
export const authRepository = {
    async findBlockedToken(token: RefreshToken): Promise<boolean> {
        const result = await blackListCollection.findOne({ refreshToken: token });

        return Boolean(result);
    },

    async addRefreshTokenToBlackList(token: RefreshToken): Promise<boolean> {
        const result = await blackListCollection.insertOne({ refreshToken: token });

        return Boolean(result.insertedId); // TODO: нужен try{}catch при работе с БД?
    }
};
