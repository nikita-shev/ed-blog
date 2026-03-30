import { inject, injectable } from 'inversify';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { jwtService } from '../../../core/application/jwt.service';
import {
    badRequestResult,
    noContentResult,
    notFoundResult,
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
import { emailAdapter, messagesForEmail } from '../../../adapters/email-adapter';
import { UserSessionData } from '../types/sessions.types';
import { AuthRepository } from '../repositories/auth.repository';
import { UsersService } from '../../users/application/users.service';

@injectable()
export class AuthService {
    constructor(
        @inject(AuthRepository) private authRepository: AuthRepository,
        @inject(UsersService) private usersService: UsersService
    ) {}

    // TODO: rename "checkUser"
    async checkUser(
        credentials: AuthInputDto,
        serviceInfo?: ServiceInfo
    ): NullableServiceDto<AuthorizationTokens> {
        const userSearchResult = await this.usersService.getUserByLoginOrEmail(
            credentials.loginOrEmail
        );

        if (!userSearchResult.data) return unauthorizedResult.create(null);

        const user = userSearchResult.data; // TODO: fix ?
        const isUser = await bcrypt.compare(credentials.password, user.accountData.password);

        if (!isUser) return unauthorizedResult.create(null);

        // ======>
        const userId = userSearchResult.data.id;
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
        // const result = await usersRepository.findUserById(userId);
        const result = await this.usersService.getUserById(userId);

        if (!result.data) return unauthorizedResult.create(null);

        const user: CurrentUser = {
            email: result.data.accountData.email,
            login: result.data.accountData.login,
            userId
        };

        return successResult.create(user);
    }

    async registrationUser(
        credentials: RegistrationInputDto
    ): Promise<ServiceDto<boolean> | ServiceDto<null>> {
        const userCreationResult = await this.usersService.createUser(credentials);

        // if (typeof result === 'object') {
        //     // return createResultObject(null, ResultStatus.BadRequest, 'Bad request', [result]);
        //     return badRequestResult.create(null, 'Bad request', [result]);
        // }
        if (!userCreationResult.data) {
            return badRequestResult.create(
                null,
                userCreationResult.errorMessage as string,
                userCreationResult.extensions
            );
        }

        // send email
        const userSearchResult = await this.usersService.getUserById(userCreationResult.data);
        if (!userSearchResult.data) return notFoundResult.create(null);

        const emailSendingStatus = await emailAdapter.sendEmail(
            userSearchResult.data.accountData.email,
            'register',
            messagesForEmail.completeRegistration(
                userSearchResult.data.emailConfirmation.confirmationCode
            )
        );

        if (!emailSendingStatus.data) {
            await this.usersService.deleteUser(userCreationResult.data);
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

    async confirmRegistrationUser(code: string): Promise<ServiceDto<boolean | null>> {
        return this.usersService.confirmUser(code);
    }

    async resendEmail(email: string): Promise<ServiceDto<boolean> | ServiceDto<null>> {
        const userSearchResult = await this.usersService.getUserByLoginOrEmail(email);

        if (!userSearchResult.data) {
            return badRequestResult.create(null, 'Bad request', [
                { field: 'email', message: 'email not found' } // TODO: duplicate
            ]);
        }

        const user = userSearchResult.data;

        if (user.emailConfirmation.isConfirmed) {
            return badRequestResult.create(null, 'Bad request', [
                {
                    field: 'email',
                    message: 'email verified'
                }
            ]);
        }

        const newCode = crypto.randomUUID();
        await this.usersService.updateConfirmationCode(user.id, newCode); // TODO: обработать результат?

        const emailSendingStatus = await emailAdapter.sendEmail(
            user.accountData.email,
            'resend',
            messagesForEmail.completeRegistration(newCode)
        );
        if (!emailSendingStatus.data) {
            // TODO: как такое тестировать, когда есть мока?
            return badRequestResult.create(null, 'Bad request', [
                {
                    field: 'resend',
                    message: 'Problems with email confirmation. Please try again later.'
                }
            ]);
        }

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
        const userSearchResult = await this.usersService.getUserByLoginOrEmail(email);

        if (!userSearchResult.data) return noContentResult.create();

        const { data: code } = await this.usersService.createPasswordCode(userSearchResult.data.id);

        // TODO: необходимо удалять код, если email сломался?
        const emailSendingStatus = await emailAdapter.sendEmail(
            userSearchResult.data.accountData.email,
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

        const userId = userSearchResult.data.id;
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
