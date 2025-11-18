import { WithId } from 'mongodb';

export interface User {
    login: string;
    email: string;
    createdAt: string;
}

export interface UserWithPassword extends User {
    password: string;
}

export type UserWithId = WithId<User>;
