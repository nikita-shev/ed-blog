import { WithId } from 'mongodb';

// TODO: IBasicUser -> UserData ?
export interface IBasicUser {
    login: string;
    email: string;
}

export interface IAccountData extends IBasicUser {
    password: string;
    createdAt: string;
}

export interface IEmailConfirmation {
    confirmationCode: string;
    expirationDate: string;
    isConfirmed: boolean;
}

export interface IPasswordRecovery {
    code: string;
    expirationDate: string;
}

export interface IUser {
    accountData: IAccountData;
    emailConfirmation: IEmailConfirmation;
    passwordRecovery?: IPasswordRecovery;
}

export interface IUserForService extends IUser {
    id: string;
}

// ===================== TODO: fix types >>>

type TAccountDataWithoutPassword = Omit<IAccountData, 'password'>;
export interface IUserWithoutPassword {
    accountData: TAccountDataWithoutPassword;
    emailConfirmation: IEmailConfirmation;
    passwordRecovery?: IPasswordRecovery;
}
export type TUserWithoutPasswordWithId = WithId<IUserWithoutPassword>;
