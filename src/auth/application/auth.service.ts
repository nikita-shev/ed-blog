import bcrypt from 'bcrypt';
import { AuthInputDto } from '../dto/auth.dto';
import { usersRepository } from '../../users/repositories/users.repository';
import { User } from '../../users/types/users.types';
import { WithId } from 'mongodb';

export const authService = {
    async checkUser(credentials: AuthInputDto): Promise<boolean> {
        const result = await usersRepository.findUser(credentials.loginOrEmail);

        if (!result) {
            return false;
        }

        const user = convertUserData(result);

        return await bcrypt.compare(credentials.password, user.password);
    }
};

// TODO: move
function convertUserData(user: WithId<User>): User {
    return {
        login: user.login,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt
    };
}
