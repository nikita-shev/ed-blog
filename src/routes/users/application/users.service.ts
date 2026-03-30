import bcrypt from 'bcrypt';
import { inject, injectable } from 'inversify';
import { UserDocument, UserModel } from '../schema/schema';
import { UsersRepository } from '../repositories/users.repository';
import { add, isPast, parseISO } from 'date-fns';
import {
    badRequestResult,
    createdResult,
    noContentResult,
    notFoundResult,
    successResult
} from '../../../core/utils/result-object';
import { mapUserDataForService } from '../routers/mappers/mapUserData';
import { UserInputDto } from '../dto/users.dto';
import { IPasswordRecovery, IUserForService } from '../types/users.types';
import { ServiceDto } from '../../../core/utils/result-object/types/result-object.types';

@injectable()
export class UsersService {
    constructor(@inject(UsersRepository) private usersRepository: UsersRepository) {}

    // TODO: проверить методы create...() в других сервисах (not CQRS)
    async createUser(credentials: UserInputDto): Promise<ServiceDto<string | null>> {
        const isUniqueEmail = await this.usersRepository.findUserByLoginOrEmail(credentials.email);
        const isUniqueLogin = await this.usersRepository.findUserByLoginOrEmail(credentials.login);
        // const isUniqueLogin = await this.usersRepository.findUserByLogin(credentials.login);
        // const isUniqueEmail = await this.usersRepository.findUserByEmail(credentials.email);

        if (isUniqueLogin || isUniqueEmail) {
            const field = isUniqueLogin ? 'login' : 'email';

            // return { field, message: `${field} should be unique` } as Error;
            return badRequestResult.create(null, 'Bad request', [
                { field, message: `${field} should be unique` }
            ]);
        }

        const hashPassword = await bcrypt.hash(credentials.password, 12); // TODO: fix "12", move to service
        const newUser: UserDocument = new UserModel({
            accountData: {
                login: credentials.login,
                email: credentials.email,
                password: hashPassword,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: crypto.randomUUID(),
                expirationDate: add(new Date(), { hours: 1 }).toISOString(), // TODO: fix date, delete date-fns (возможно)
                isConfirmed: false
            }
        });
        await this.usersRepository.save(newUser);

        return createdResult.create(newUser.id);
    }

    async getUserById(userId: string): Promise<ServiceDto<IUserForService | null>> {
        const user = await this.usersRepository.findUserById(userId);

        if (!user) return notFoundResult.create(null);

        return successResult.create(mapUserDataForService(user));
    }

    async getUserByLoginOrEmail(data: string): Promise<ServiceDto<IUserForService | null>> {
        const user = await this.usersRepository.findUserByLoginOrEmail(data);

        if (!user) return notFoundResult.create();

        return successResult.create(mapUserDataForService(user));
    }

    async confirmUser(code: string): Promise<ServiceDto<boolean | null>> {
        const user = await this.usersRepository.findUserByCode(
            'emailConfirmation.confirmationCode',
            code
        );

        if (!user) {
            return badRequestResult.create(null, 'Bad Request', [
                { field: 'code', message: 'Code is invalid' } // TODO: duplicate
            ]);
        }

        const hasExpired = isPast(parseISO(user.emailConfirmation.expirationDate));
        if (user.emailConfirmation.isConfirmed || hasExpired) {
            return badRequestResult.create(null, 'Bad Request', [
                { field: 'code', message: 'Code is invalid' } // TODO: duplicate
            ]);
        }

        user.emailConfirmation.isConfirmed = true;
        await this.usersRepository.save(user);

        return noContentResult.create(true);
    }

    async deleteUser(id: string): Promise<ServiceDto<boolean | null>> {
        const result = await this.usersRepository.deleteUser(id);

        return result ? noContentResult.create(result) : notFoundResult.create();
    }

    async createPasswordCode(userId: string): Promise<ServiceDto<string>> {
        const user = await this.usersRepository.findUserById(userId);

        if (!user) return notFoundResult.create();

        const passwordRecovery: IPasswordRecovery = {
            code: crypto.randomUUID(),
            expirationDate: add(new Date(), { hours: 1 }).toISOString() // TODO: fix date
        };

        user.passwordRecovery = passwordRecovery;
        await this.usersRepository.save(user);

        return successResult.create(passwordRecovery.code);
    }

    async getUserByCode(type: string, code: string): Promise<ServiceDto<IUserForService | null>> {
        const user = await this.usersRepository.findUserByCode(type, code);

        return user ? successResult.create(mapUserDataForService(user)) : notFoundResult.create();
    }

    async updatePassword(userId: string, newPassword: string): Promise<ServiceDto<boolean | null>> {
        const user = await this.usersRepository.findUserById(userId);

        if (!user) return notFoundResult.create();

        user.accountData.password = newPassword;
        await this.usersRepository.save(user);

        return successResult.create(true);
    }

    async deleteRecoveryCode(userId: string): Promise<ServiceDto<boolean>> {
        const result = await this.usersRepository.deleteRecoveryCode(userId);

        return successResult.create(result);
    }

    async updateConfirmationCode(
        userId: string,
        newCode: string
    ): Promise<ServiceDto<boolean | null>> {
        const user = await this.usersRepository.findUserById(userId);

        if (!user) return notFoundResult.create();

        user.emailConfirmation.confirmationCode = newCode;
        await this.usersRepository.save(user);

        return successResult.create(true);
    }
}
