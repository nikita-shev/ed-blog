import { userCollection } from '../../db/db.config';
import { User } from '../types/users.types';
import { ObjectId, WithId } from 'mongodb';
import { createResultObject } from '../../core/result-object/utils/createResultObject';
import { ResultObject, ResultStatus } from '../../core/result-object/result-object.types';

export const usersRepository = {
    async findUser(loginOrEmail: string): Promise<WithId<User> | null> {
        return userCollection.findOne({
            $or: [{ login: loginOrEmail }, { email: loginOrEmail }]
        });
    },

    async findUserById(userId: string): Promise<WithId<User> | null> {
        return userCollection.findOne({ _id: new ObjectId(userId) });
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

    async findUserByConfirmationCode(code: string): Promise<WithId<User> | null> {
        return userCollection.findOne({ 'emailConfirmation.confirmationCode': code });
    },

    async createUser(credentials: User): Promise<string> {
        const result = await userCollection.insertOne(credentials);

        return result.insertedId.toString();
    },

    async confirmUser(id: ObjectId): Promise<ResultObject<boolean>> {
        const result = await userCollection.updateOne(
            { _id: id },
            { $set: { 'emailConfirmation.isConfirmed': true } }
        );
        const isUpdated = result.matchedCount === 1;

        return createResultObject(
            isUpdated,
            isUpdated ? ResultStatus.NoContent : ResultStatus.BadRequest
        );
    },

    async deleteUser(id: string): Promise<boolean> {
        const result = await userCollection.deleteOne({ _id: new ObjectId(id) });

        return result.deletedCount === 1;
    }
};
