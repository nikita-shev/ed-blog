import bcrypt from 'bcrypt';
import { UserInputDto } from '../dto/users.dto';
import { usersRepository } from '../repositories/users.repository';
import { Error } from '../../core/types/error.types';
import { UserWithPassword } from '../types/users.types';

export const usersService = {
    async createUser(credentials: UserInputDto): Promise<Error | string> {
        const isUniqueLogin = await usersRepository.findUserByLogin(credentials.login);
        const isUniqueEmail = await usersRepository.findUserByEmail(credentials.email);

        if (isUniqueLogin || isUniqueEmail) {
            const field = isUniqueLogin ? 'login' : 'email';

            return { field, message: `${field} should be unique` } as Error;
        }

        const hashPassword = await bcrypt.hash(credentials.password, 12);
        const newUser: UserWithPassword = {
            login: credentials.login,
            email: credentials.email,
            password: hashPassword,
            createdAt: new Date().toISOString()
        };

        return await usersRepository.createUser(newUser);
    },

    async deleteUser(id: string): Promise<boolean> {
        return usersRepository.deleteUser(id);
    }
};
