import { UserDocument } from '../../schema/schema';
import { IUserForService, TUserWithoutPasswordWithId } from '../../types/users.types';
import { UserOutputDto } from '../../dto/users.dto';

export function mapUserDataForDto(user: TUserWithoutPasswordWithId): UserOutputDto {
    return {
        id: user._id.toString(),
        login: user.accountData.login,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt
    };
}

export function mapUserDataForService(data: UserDocument): IUserForService {
    return {
        id: data._id.toString(),
        accountData: {
            login: data.accountData.login,
            email: data.accountData.email,
            password: data.accountData.password,
            createdAt: data.accountData.createdAt
        },
        emailConfirmation: data.emailConfirmation
    };
}
