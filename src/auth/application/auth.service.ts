import bcrypt from 'bcrypt';
import { usersRepository } from '../../users/repositories/users.repository';
import { jwtService } from '../../core/application/jwt.service';
import { createResultObject } from '../../core/result-object/utils/createResultObject';
import {
    AuthorizationTokens,
    AuthInputDto,
    RegistrationInputDto,
    RefreshToken
} from '../dto/auth.dto';
import {
    NullableResultObject,
    ResultObject,
    ResultStatus
} from '../../core/result-object/result-object.types';
import { CurrentUser } from '../types/auth.types';
import { usersService } from '../../users/application/users.service';
import { createMessage, emailAdapter } from '../../adapters/email-adapter';
import { authRepository } from '../repositories/auth.repository';

export const authService = {
    // TODO: rename "checkUser"
    async checkUser(credentials: AuthInputDto): NullableResultObject<AuthorizationTokens> {
        const result = await usersRepository.findUser(credentials.loginOrEmail); // TODO: так можно использовать или нужен сервис

        if (!result) {
            return createResultObject(null, ResultStatus.Unauthorized);
        }

        const isUser = await bcrypt.compare(credentials.password, result.password);

        if (isUser) {
            const payload = { userId: result._id.toString() }; // TODO: что хранить в payload`е для refreshToken ???
            const accessToken = jwtService.createToken(payload, { expiresIn: '10s' });
            const refreshToken = jwtService.createToken(payload, { expiresIn: '20s' });

            return createResultObject({
                accessToken: accessToken.data,
                refreshToken: refreshToken.data
            });
        } else {
            return createResultObject(null, ResultStatus.Unauthorized);
        }
    },

    // TODO: Q: authBearerMiddleware проверил токен, но findUserById всегда будет возвращать null. Как быть?
    async getInfoAboutUser(userId: string): NullableResultObject<CurrentUser> {
        const result = await usersRepository.findUserById(userId);

        if (!result) {
            return createResultObject(null, ResultStatus.Unauthorized);
        }

        const user: CurrentUser = { email: result.email, login: result.login, userId };

        return createResultObject(user);
    },

    async registrationUser(
        credentials: RegistrationInputDto
    ): Promise<ResultObject<boolean> | ResultObject<null>> {
        const result = await usersService.createUser(credentials);

        if (typeof result === 'object') {
            return createResultObject(null, ResultStatus.BadRequest, 'Bad request', [result]);
        }

        // send email
        const userInfo = await usersService.getUserInfo(result);
        if (!userInfo.data) return userInfo;

        const emailSendingStatus = await emailAdapter.sendEmail(
            userInfo.data.email,
            'register',
            createMessage(userInfo.data.emailConfirmation.confirmationCode)
        );

        if (!emailSendingStatus.data) {
            await usersService.deleteUser(result);
            return createResultObject(null, ResultStatus.BadRequest, 'Bad request', [
                { field: 'login', message: 'Problems registering. Please try again later.' }
            ]);
        }

        return createResultObject(emailSendingStatus.data, ResultStatus.NoContent);
    },

    async confirmRegistrationUser(
        code: string
    ): Promise<ResultObject<boolean> | ResultObject<null>> {
        return usersService.confirmUser(code);
    },

    async resendEmail(email: string): Promise<ResultObject<boolean> | ResultObject<null>> {
        const user = await usersRepository.findUser(email);
        if (!user)
            return createResultObject(null, ResultStatus.BadRequest, 'Bad request', [
                { field: 'email', message: 'email not found' }
            ]);

        const { emailConfirmation } = user;
        if (emailConfirmation.isConfirmed) {
            return createResultObject(null, ResultStatus.BadRequest, 'Bad request', [
                {
                    field: 'email',
                    message: 'email verified'
                }
            ]);
        }

        const newCode = crypto.randomUUID();
        await usersRepository.updateConfirmationCode(user._id, newCode); // TODO: обработать результат?

        const emailSendingStatus = await emailAdapter.sendEmail(
            user.email,
            'resend',
            createMessage(newCode)
        );
        if (!emailSendingStatus.data) {
            return createResultObject(null, ResultStatus.BadRequest, 'Bad request', [
                {
                    field: 'resend',
                    message: 'Problems with email confirmation. Please try again later.'
                }
            ]);
        }

        return createResultObject(emailSendingStatus.data, ResultStatus.NoContent);
    },

    async replaceRefreshToken(token: RefreshToken): NullableResultObject<AuthorizationTokens> {
        const isValidToken = await authRepository.checkToken(token);
        if (!isValidToken) return createResultObject(null, ResultStatus.Unauthorized);

        const result = jwtService.checkToken(token);
        if (!result.data) return result;

        await authRepository.addRefreshTokenToBlackList(token); // TODO: обрабатывать результат выполнения ???

        const payload = { userId: result.data.userId }; // TODO: что хранить в payload`е для refreshToken ???
        const accessToken = jwtService.createToken(payload, { expiresIn: '10s' });
        const refreshToken = jwtService.createToken(payload, { expiresIn: '20s' });

        return createResultObject({
            accessToken: accessToken.data,
            refreshToken: refreshToken.data
        });
    }
};
