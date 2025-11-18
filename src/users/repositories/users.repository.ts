import { userCollection } from '../../db/db.config';
import { User } from '../types/users.types';
import { ObjectId, WithId } from 'mongodb';

export const usersRepository = {
    async findUser(loginOrEmail: string): Promise<WithId<User> | null> {
        return userCollection.findOne({
            $or: [{ login: loginOrEmail }, { email: loginOrEmail }]
        });
    },

    // TODO: duplicate findUserByLogin & findUserByEmail
    async findUserByLogin(login: string): Promise<boolean> {
        const user = await userCollection.findOne({ login });

        return Boolean(user);
    },

    async findUserByEmail(email: string): Promise<boolean> {
        const user = await userCollection.findOne({ email });

        return Boolean(user);
    },

    async createUser(credentials: User): Promise<string> {
        const result = await userCollection.insertOne(credentials);

        return result.insertedId.toString();
    },

    async deleteUser(id: string): Promise<boolean> {
        const result = await userCollection.deleteOne({ _id: new ObjectId(id) });

        return result.deletedCount === 1;
    }
};
