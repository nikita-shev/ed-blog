import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { usersRepository } from '../../users/repositories/users.repository';
import { jwtService } from '../../core/application/jwt.service';
import { createResultObject } from '../../core/result-object/utils/createResultObject';
import {
    AuthInputDto,
    AuthorizationTokens,
    RefreshToken,
    RegistrationInputDto
} from '../dto/auth.dto';
import {
    NullableResultObject,
    ResultObject,
    ResultStatus
} from '../../core/result-object/result-object.types';
import { CurrentUser, ServiceInfo } from '../types/auth.types';
import { usersService } from '../../users/application/users.service';
import { createMessage, emailAdapter } from '../../adapters/email-adapter';
import { authRepository } from '../repositories/auth.repository';
import { UserSessionData } from '../types/sessions.types';

export const authService = {
    // TODO: rename "checkUser"
    async checkUser(
        credentials: AuthInputDto,
        serviceInfo?: ServiceInfo
    ): NullableResultObject<AuthorizationTokens> {
        const result = await usersRepository.findUser(credentials.loginOrEmail); // TODO: так можно использовать или нужен сервис

        if (!result) {
            return createResultObject(null, ResultStatus.Unauthorized);
        }

        const isUser = await bcrypt.compare(credentials.password, result.password);

        if (isUser) {
            const atPayload = { userId: result._id.toString() };
            const rtPayload = {
                userId: result._id.toString(),
                deviceId: uuid()
            };
            const accessToken = jwtService.createToken(atPayload, { expiresIn: '10s' });
            const refreshToken = jwtService.createToken(rtPayload, { expiresIn: '20s' });

            const payload = jwtService.decode<RefreshTokenPayload>(refreshToken.data); // TODO: Fix "any"
            const d = {
                // TODO: fix types, names, move
                device: serviceInfo?.device ?? '',
                iat: new Date(payload.data.iat).toISOString(),
                exp: new Date(payload.data.exp).toISOString()
            };
            await authRepository.addUserSession({ ...rtPayload, ...payload.data, ...d }); // TODO: делать проверку, что всё ок???

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

    // TODO: move sessions???
    async findSession(token: RefreshToken): Promise<ResultObject<boolean>> {
        const { data: payload } = jwtService.decode<UserSessionData>(token);
        const isValidToken = await authRepository.findSession(payload);

        return createResultObject(
            isValidToken,
            isValidToken ? ResultStatus.Success : ResultStatus.Unauthorized
        );
    },

    async deleteSession(token: RefreshToken): Promise<ResultObject<boolean>> {
        const { data } = jwtService.decode<RefreshTokenPayload>(token);
        const result = await authRepository.deleteSession(data.deviceId);

        return createResultObject(result, ResultStatus.NoContent);
    },

    async replaceRefreshToken(
        userId: string, // TODO: нужен?
        token: RefreshToken
    ): NullableResultObject<AuthorizationTokens> {
        const { data } = jwtService.decode<RefreshTokenPayload>(token);
        const accessToken = jwtService.createToken({ userId: data.userId }, { expiresIn: '10s' });
        const refreshToken = jwtService.createToken(
            { userId: data.userId, deviceId: data.deviceId },
            { expiresIn: '20s' }
        );

        const result = jwtService.decode<RefreshTokenPayload>(refreshToken.data);
        await authRepository.replaceUserSession({
            ...result.data,
            iat: new Date(result.data.iat).toISOString(),
            exp: new Date(result.data.exp).toISOString()
        });

        return createResultObject({
            accessToken: accessToken.data,
            refreshToken: refreshToken.data
        });
    }
};

// TODO: Логика формирования jwt в методах replaceRefreshToken и checkUser дублируется. Исрпавить.

// TODO: move
export interface RefreshTokenPayload {
    userId: string;
    deviceId: string;
    iat: string;
    exp: string;
}
