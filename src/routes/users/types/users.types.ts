import { WithId } from 'mongodb';

export interface BasicUser {
    login: string;
    email: string;
}

export interface User extends BasicUser {
    password: string;
    createdAt: string;
    emailConfirmation: EmailConfirmation;
}

export type UserWithoutPassword = Omit<User, 'password'>;
export type UserWithId = WithId<UserWithoutPassword>; // TODO: add With & Without password

// new user types ===>

interface AccountData {
    login: string;
    email: string;
    password: string;
    createdAt: string;
}

interface EmailConfirmation {
    confirmationCode: string;
    expirationDate: string;
    isConfirmed: boolean;
}

// TODO: исправить название и переделать старые типы на новые
// interface UserData {
//     accountData: AccountData;
//     emailConfirmation: EmailConfirmation;
// }
//
// type UserDataWithId = WithId<UserData>;
