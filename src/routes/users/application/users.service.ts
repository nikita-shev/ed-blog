import { inject, injectable } from 'inversify';
import bcrypt from 'bcrypt';
import { UserInputDto } from '../dto/users.dto';
import { UsersRepository } from '../repositories/users.repository';
import { Error } from '../../../core/types/error.types';
import { PasswordRecovery, User, UserWithoutPassword } from '../types/users.types';
import { add, isPast, parseISO } from 'date-fns';
import {
    badRequestResult,
    noContentResult,
    notFoundResult,
    successResult
} from '../../../core/utils/result-object';
import { ServiceDto } from '../../../core/utils/result-object/types/result-object.types';
import { convertFullUserInfo } from '../routers/mappers/mapToUserOutput';
import { WithId } from 'mongodb';

@injectable()
export class UsersService {
    constructor(@inject(UsersRepository) private usersRepository: UsersRepository) {}

    async createUser(credentials: UserInputDto): Promise<Error | string> {
        const isUniqueLogin = await this.usersRepository.findUserByLogin(credentials.login);
        const isUniqueEmail = await this.usersRepository.findUserByEmail(credentials.email);
        // TODO: одним запросом, испр. ошибку
        if (isUniqueLogin || isUniqueEmail) {
            const field = isUniqueLogin ? 'login' : 'email';

            return { field, message: `${field} should be unique` } as Error;
        }

        const hashPassword = await bcrypt.hash(credentials.password, 12); // TODO: fix "12"
        const newUser: User = {
            login: credentials.login,
            email: credentials.email,
            password: hashPassword,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: crypto.randomUUID(),
                expirationDate: add(new Date(), { hours: 1 }).toISOString(), // TODO: fix date
                isConfirmed: false
            }
        };

        return await this.usersRepository.createUser(newUser);
    }

    async getUserInfo(userId: string): Promise<ServiceDto<UserWithoutPassword> | ServiceDto<null>> {
        const result = await this.usersRepository.findUserById(userId);

        // if (!result) return createResultObject(null, ResultStatus.NotFound);
        if (!result) return notFoundResult.create();
        // return createResultObject(convertFullUserInfo(result));
        return successResult.create(convertFullUserInfo(result));
    }

    // TODO: заменить в authService => checkUser()
    async getUserByLoginOrEmail(data: string): Promise<ServiceDto<WithId<User> | null>> {
        const user = await this.usersRepository.findUser(data);

        if (!user) return notFoundResult.create();

        return successResult.create(user);
    }

    async confirmUser(code: string): Promise<ServiceDto<boolean> | ServiceDto<null>> {
        const userInfo = await this.usersRepository.findUserByConfirmationCode(code);
        if (!userInfo)
            // return createResultObject(userInfo, ResultStatus.BadRequest, 'Bad Request', [
            //     { field: 'code', message: 'Code is invalid' }
            // ]);
            return badRequestResult.create(userInfo, 'Bad Request', [
                { field: 'code', message: 'Code is invalid' }
            ]);

        const { emailConfirmation } = userInfo;
        const hasExpired = isPast(parseISO(emailConfirmation.expirationDate));
        if (emailConfirmation.isConfirmed || hasExpired) {
            // return createResultObject(null, ResultStatus.BadRequest, 'Bad Request', [
            //     { field: 'code', message: 'Code is invalid' }
            // ]);
            return badRequestResult.create(null, 'Bad Request', [
                { field: 'code', message: 'Code is invalid' }
            ]);
        }

        // return await usersRepository.confirmUser(userInfo._id);
        const isConfirmUser = await this.usersRepository.confirmUser(userInfo._id);

        return isConfirmUser
            ? noContentResult.create(isConfirmUser)
            : badRequestResult.create(isConfirmUser, 'Bad Request');
    }

    async deleteUser(id: string): Promise<boolean> {
        return this.usersRepository.deleteUser(id);
    }

    async createPasswordCode(id: string): Promise<ServiceDto<string>> {
        const passwordRecovery: PasswordRecovery = {
            code: crypto.randomUUID(),
            expirationDate: add(new Date(), { hours: 1 }).toISOString() // TODO: fix date
        };
        await this.usersRepository.createPasswordCode(id, passwordRecovery); // TODO: обработать возврат или вернуть код???

        return successResult.create(passwordRecovery.code);
    }

    async getUserByCode(type: string, code: string): Promise<ServiceDto<WithId<User> | null>> {
        const user = await this.usersRepository.findUserByCode(type, code);

        return user ? successResult.create(user) : notFoundResult.create();
    }

    async updatePassword(userId: string, newPassword: string): Promise<ServiceDto<boolean>> {
        const result = await this.usersRepository.updatePassword(userId, newPassword);

        return successResult.create(result);
    }

    async deleteRecoveryCode(userId: string): Promise<ServiceDto<boolean>> {
        const result = await this.usersRepository.deleteRecoveryCode(userId);

        return successResult.create(result);
    }
}
