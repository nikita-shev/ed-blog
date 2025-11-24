import { WithId } from 'mongodb';

export interface BasicUser {
    login: string;
    email: string;
}

export interface User extends BasicUser {
    password: string;
    createdAt: string;
}

export type UserWithoutPassword = Omit<User, 'password'>;
export type UserWithId = WithId<UserWithoutPassword>; // TODO: add With & Without password
