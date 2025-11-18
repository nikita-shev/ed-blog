import { WithId } from 'mongodb';

export interface User {
    login: string;
    email: string;
    password: string;
    createdAt: string;
}

export type UserWithoutPassword = Omit<User, 'password'>;
export type UserWithId = WithId<UserWithoutPassword>; // TODO: add With & Without password
