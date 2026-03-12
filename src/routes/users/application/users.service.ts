import bcrypt from 'bcrypt';
import { UserInputDto } from '../dto/users.dto';
import { usersRepository } from '../repositories/users.repository';
import { Error } from '../../../core/types/error.types';
import { User, UserWithoutPassword } from '../types/users.types';
import { add, isPast, parseISO } from 'date-fns';
import {
    badRequestResult,
    noContentResult,
    notFoundResult,
    successResult
} from '../../../core/utils/result-object';
import { ServiceDto } from '../../../core/utils/result-object/types/result-object.types';
import { convertFullUserInfo } from '../routers/mappers/mapToUserOutput';

export const usersService = {
    async createUser(credentials: UserInputDto): Promise<Error | string> {
        const isUniqueLogin = await usersRepository.findUserByLogin(credentials.login);
        const isUniqueEmail = await usersRepository.findUserByEmail(credentials.email);
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

        return await usersRepository.createUser(newUser);
    },

    async getUserInfo(userId: string): Promise<ServiceDto<UserWithoutPassword> | ServiceDto<null>> {
        const result = await usersRepository.findUserById(userId);

        // if (!result) return createResultObject(null, ResultStatus.NotFound);
        if (!result) return notFoundResult.create();
        // return createResultObject(convertFullUserInfo(result));
        return successResult.create(convertFullUserInfo(result));
    },

    async confirmUser(code: string): Promise<ServiceDto<boolean> | ServiceDto<null>> {
        const userInfo = await usersRepository.findUserByConfirmationCode(code);
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
        const isConfirmUser = await usersRepository.confirmUser(userInfo._id);

        return isConfirmUser
            ? noContentResult.create(isConfirmUser)
            : badRequestResult.create(isConfirmUser, 'Bad Request');
    },

    async deleteUser(id: string): Promise<boolean> {
        return usersRepository.deleteUser(id);
    }
};
