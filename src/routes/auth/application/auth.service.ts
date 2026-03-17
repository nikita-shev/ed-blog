import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { usersRepository, usersService } from '../../../composition-root';
import { jwtService } from '../../../core/application/jwt.service';
import {
    badRequestResult,
    noContentResult,
    successResult,
    unauthorizedResult
} from '../../../core/utils/result-object';
import {
    AuthInputDto,
    AuthorizationTokens,
    RefreshToken,
    RegistrationInputDto
} from '../dto/auth.dto';
import {
    NullableServiceDto,
    ServiceDto
} from '../../../core/utils/result-object/types/result-object.types';
import { CurrentUser, ServiceInfo } from '../types/auth.types';
import { messagesForEmail, emailAdapter } from '../../../adapters/email-adapter';
import { UserSessionData } from '../types/sessions.types';
import { AuthRepository } from '../repositories/auth.repository';
import { UsersService } from '../../users/application/users.service';

export class AuthService {
    constructor(
        private authRepository: AuthRepository,
        private usersService: UsersService
    ) {}

    // TODO: rename "checkUser"
    async checkUser(
        credentials: AuthInputDto,
        serviceInfo?: ServiceInfo
    ): NullableServiceDto<AuthorizationTokens> {
        // console.log(credentials, serviceInfo);

        const userData = await usersRepository.findUser(credentials.loginOrEmail); // TODO: repo or service?
        // if (!userData) return createResultObject(null, ResultStatus.Unauthorized);
        if (!userData) return unauthorizedResult.create();

        const isUser = await bcrypt.compare(credentials.password, userData.password);
        // if (!isUser) return createResultObject(null, ResultStatus.Unauthorized);
        if (!isUser) return unauthorizedResult.create();

        // ======>
        const userId = userData._id.toString();
        const userDevice = serviceInfo?.device ?? '';
        const userIp = serviceInfo?.ip ?? '';

        const lastSession = await this.authRepository.findSessionByDevice(
            userId,
            userDevice,
            userIp
        );

        if (lastSession) {
            const { deviceId } = lastSession;

            const accessToken = jwtService.createToken({ userId }, { expiresIn: '10s' });
            const refreshToken = jwtService.createToken({ userId, deviceId }, { expiresIn: '20s' });
            const decodeResult = jwtService.decode<RefreshTokenPayload>(refreshToken.data);

            await this.authRepository.replaceUserSession({
                ...decodeResult.data,
                iat: new Date(decodeResult.data.iat).toISOString(),
                exp: new Date(decodeResult.data.exp).toISOString()
            });

            // return createResultObject({
            //     accessToken: accessToken.data,
            //     refreshToken: refreshToken.data
            // });
            return successResult.create({
                accessToken: accessToken.data,
                refreshToken: refreshToken.data
            });
        }

        // ======>
        const accessToken = jwtService.createToken({ userId }, { expiresIn: '10s' });
        const refreshToken = jwtService.createToken(
            { userId, deviceId: randomUUID() },
            { expiresIn: '20s' }
        );

        const payload = jwtService.decode<RefreshTokenPayload>(refreshToken.data); // TODO: Fix "any"
        const d = {
            // TODO: fix types, names, move
            device: userDevice,
            ip: userIp,
            iat: new Date(payload.data.iat).toISOString(),
            exp: new Date(payload.data.exp).toISOString()
        };
        await this.authRepository.addUserSession({ ...payload.data, ...d }); // TODO: Check if everything is completed?

        // return createResultObject({
        //     accessToken: accessToken.data,
        //     refreshToken: refreshToken.data
        // });
        return successResult.create({
            accessToken: accessToken.data,
            refreshToken: refreshToken.data
        });
    }

    // TODO: Q: authBearerMiddleware проверил токен, но findUserById всегда будет возвращать null. Как быть?
    async getInfoAboutUser(userId: string): NullableServiceDto<CurrentUser> {
        const result = await usersRepository.findUserById(userId);

        if (!result) {
            // return createResultObject(null, ResultStatus.Unauthorized);
            return unauthorizedResult.create();
        }

        const user: CurrentUser = { email: result.email, login: result.login, userId };

        // return createResultObject(user);
        return successResult.create(user);
    }

    async registrationUser(
        credentials: RegistrationInputDto
    ): Promise<ServiceDto<boolean> | ServiceDto<null>> {
        const result = await usersService.createUser(credentials);

        if (typeof result === 'object') {
            // return createResultObject(null, ResultStatus.BadRequest, 'Bad request', [result]);
            return badRequestResult.create(null, 'Bad request', [result]);
        }

        // send email
        const userInfo = await usersService.getUserInfo(result);
        if (!userInfo.data) return userInfo;

        const emailSendingStatus = await emailAdapter.sendEmail(
            userInfo.data.email,
            'register',
            messagesForEmail.completeRegistration(userInfo.data.emailConfirmation.confirmationCode)
        );

        if (!emailSendingStatus.data) {
            await usersService.deleteUser(result);
            // return createResultObject(null, ResultStatus.BadRequest, 'Bad request', [
            //     { field: 'login', message: 'Problems registering. Please try again later.' }
            // ]);
            return badRequestResult.create(null, 'Bad request', [
                { field: 'login', message: 'Problems registering. Please try again later.' }
            ]);
        }

        // return createResultObject(emailSendingStatus.data, ResultStatus.NoContent);
        return noContentResult.create(emailSendingStatus.data);
    }

    async confirmRegistrationUser(code: string): Promise<ServiceDto<boolean> | ServiceDto<null>> {
        return usersService.confirmUser(code);
    }

    async resendEmail(email: string): Promise<ServiceDto<boolean> | ServiceDto<null>> {
        const user = await usersRepository.findUser(email);
        if (!user)
            // return createResultObject(null, ResultStatus.BadRequest, 'Bad request', [
            //     { field: 'email', message: 'email not found' }
            // ]);
            return badRequestResult.create(null, 'Bad request', [
                { field: 'email', message: 'email not found' } // TODO: duplicate
            ]);

        const { emailConfirmation } = user;
        if (emailConfirmation.isConfirmed) {
            // return createResultObject(null, ResultStatus.BadRequest, 'Bad request', [
            //     {
            //         field: 'email',
            //         message: 'email verified'
            //     }
            // ]);
            return badRequestResult.create(null, 'Bad request', [
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
            messagesForEmail.completeRegistration(newCode)
        );
        if (!emailSendingStatus.data) {
            // TODO: как такое тестировать, когда есть мока?
            // return createResultObject(null, ResultStatus.BadRequest, 'Bad request', [
            //     {
            //         field: 'resend',
            //         message: 'Problems with email confirmation. Please try again later.'
            //     }
            // ]);
            return badRequestResult.create(null, 'Bad request', [
                {
                    field: 'resend',
                    message: 'Problems with email confirmation. Please try again later.'
                }
            ]);
        }

        // return createResultObject(emailSendingStatus.data, ResultStatus.NoContent);
        return noContentResult.create(emailSendingStatus.data);
    }

    // TODO: move sessions???
    async findSession(token: RefreshToken): Promise<ServiceDto<boolean>> {
        const { data: payload } = jwtService.decode<UserSessionData>(token);
        const result = await this.authRepository.findSession(payload);

        // return createResultObject(
        //     Boolean(result),
        //     Boolean(result) ? ResultStatus.Success : ResultStatus.Unauthorized
        // );
        return Boolean(result)
            ? successResult.create(Boolean(result))
            : unauthorizedResult.create(Boolean(result));
    }

    async deleteSession(token: RefreshToken): Promise<ServiceDto<boolean>> {
        const { data } = jwtService.decode<RefreshTokenPayload>(token);
        const result = await this.authRepository.deleteSession(data.deviceId);

        // return createResultObject(result, ResultStatus.NoContent);
        return noContentResult.create(result);
    }

    async replaceRefreshToken(
        userId: string, // TODO: need?
        token: RefreshToken
    ): NullableServiceDto<AuthorizationTokens> {
        const { data } = jwtService.decode<RefreshTokenPayload>(token);
        const accessToken = jwtService.createToken({ userId: data.userId }, { expiresIn: '10s' });
        const refreshToken = jwtService.createToken(
            { userId: data.userId, deviceId: data.deviceId },
            { expiresIn: '20s' }
        );

        const result = jwtService.decode<RefreshTokenPayload>(refreshToken.data);
        await this.authRepository.replaceUserSession({
            ...result.data,
            iat: new Date(result.data.iat).toISOString(),
            exp: new Date(result.data.exp).toISOString()
        });

        // return createResultObject({
        //     accessToken: accessToken.data,
        //     refreshToken: refreshToken.data
        // });
        return successResult.create({
            accessToken: accessToken.data,
            refreshToken: refreshToken.data
        });
    }

    async passwordRecovery(email: string): Promise<ServiceDto<boolean>> {
        const userInfo = await this.usersService.getUserByLoginOrEmail(email);

        console.log(email, userInfo.data); // TODO: delete

        if (!userInfo.data) return noContentResult.create();

        const { data: code } = await this.usersService.createPasswordCode(
            userInfo.data._id.toString()
        );

        // TODO: необходимо удалять код, если email сломался?
        const emailSendingStatus = await emailAdapter.sendEmail(
            userInfo.data.email,
            'Password recovery',
            messagesForEmail.passwordRecovery(code)
        );

        return noContentResult.create(emailSendingStatus.data); // emailSendingStatus.data - не обязательно, можно просто true
    }

    async createNewPassword(newPassword: string, recoveryCode: string): Promise<ServiceDto> {
        console.log(newPassword, recoveryCode); // TODO: delete

        const userSearchResult = await this.usersService.getUserByCode(
            'passwordRecovery.code',
            recoveryCode
        );

        if (!userSearchResult.data)
            return badRequestResult.create(null, 'Bad request', [
                { field: 'recoveryCode', message: 'recoveryCode is incorrect.' }
            ]);

        const expirationDate = userSearchResult.data.passwordRecovery?.expirationDate;
        if (expirationDate && new Date(expirationDate) < new Date()) {
            return badRequestResult.create(null, 'Bad request');
        }

        const userId = userSearchResult.data._id.toString();
        const hashPassword = await bcrypt.hash(newPassword, 12); // TODO: to service
        const passwordUpdateResult = await this.usersService.updatePassword(userId, hashPassword);
        if (!passwordUpdateResult.data) return badRequestResult.create(null, 'Bad request');

        await this.usersService.deleteRecoveryCode(userId);

        return noContentResult.create();
    }
}

// TODO: Возможно дублируется логика в replaceRefreshToken() и checkUser() (блок lastSession)
// TODO: Логика формирования jwt в методах replaceRefreshToken и checkUser дублируется. Исправить.

// TODO: move
export interface RefreshTokenPayload {
    userId: string;
    deviceId: string;
    iat: string;
    exp: string;
}
