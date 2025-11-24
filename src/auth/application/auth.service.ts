import bcrypt from 'bcrypt';
import { usersRepository } from '../../users/repositories/users.repository';
import { jwtService } from '../../core/application/jwt.service';
import { createResultObject } from '../../core/result-object/utils/createResultObject';
import { AccessToken, AuthInputDto } from '../dto/auth.dto';
import { NullableResultObject, ResultStatus } from '../../core/result-object/result-object.types';
import { CurrentUser } from '../types/auth.types';

export const authService = {
    // TODO: rename "checkUser"
    async checkUser(credentials: AuthInputDto): NullableResultObject<AccessToken> {
        const result = await usersRepository.findUser(credentials.loginOrEmail);

        if (!result) {
            return createResultObject(null, ResultStatus.Unauthorized);
        }

        const isUser = await bcrypt.compare(credentials.password, result.password);

        if (isUser) {
            const token = jwtService.createToken({ userId: result._id.toString() });

            return createResultObject({
                accessToken: token.data
            });
        } else {
            return createResultObject(null, ResultStatus.Unauthorized);
        }
    },

    // TODO: Q
    async getInfoAboutUser(userId: string): NullableResultObject<CurrentUser> {
        const result = await usersRepository.findUserById(userId);

        if (!result) {
            return createResultObject(null, ResultStatus.Unauthorized);
        }

        const user: CurrentUser = { email: result.email, login: result.login, userId };

        return createResultObject(user);
    }
};

// Q: authBearerMiddleware проверил токен, но findUserById всегда будет возвращать null. Как быть?
