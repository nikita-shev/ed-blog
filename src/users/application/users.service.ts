import bcrypt from 'bcrypt';
import { UserInputDto } from '../dto/users.dto';
import { usersRepository } from '../repositories/users.repository';
import { Error } from '../../core/types/error.types';
import { User, UserWithoutPassword } from '../types/users.types';
import { add } from 'date-fns';
import { WithId } from 'mongodb';
import { createResultObject } from '../../core/result-object/utils/createResultObject';
import { ResultObject, ResultStatus } from '../../core/result-object/result-object.types';
import { convertFullUserInfo, convertUserData } from '../routers/mappers/mapToUserOutput';

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

    async getUserInfo(
        userId: string
    ): Promise<ResultObject<UserWithoutPassword> | ResultObject<null>> {
        const result = await usersRepository.findUserById(userId);

        if (!result) return createResultObject(null, ResultStatus.NotFound);
        return createResultObject(convertFullUserInfo(result));
    },

    async deleteUser(id: string): Promise<boolean> {
        return usersRepository.deleteUser(id);
    }
};
