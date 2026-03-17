import { userCollection } from '../../../db/db.config';
import { PasswordRecovery, User } from '../types/users.types';
import { ObjectId, WithId } from 'mongodb';

export class UsersRepository {
    async findUser(loginOrEmail: string): Promise<WithId<User> | null> {
        return userCollection.findOne({
            $or: [{ login: loginOrEmail }, { email: loginOrEmail }]
        });
    }

    async findUserById(userId: string): Promise<WithId<User> | null> {
        return userCollection.findOne({ _id: new ObjectId(userId) });
    }

    // TODO: duplicate findUserByLogin & findUserByEmail
    async findUserByLogin(login: string): Promise<boolean> {
        const user = await userCollection.findOne({ login });

        return Boolean(user);
    }

    // TODO: findUser() => поиск и по логину, и по email
    async findUserByEmail(email: string): Promise<boolean> {
        const user = await userCollection.findOne({ email });

        return Boolean(user);
    }

    async findUserByConfirmationCode(code: string): Promise<WithId<User> | null> {
        return userCollection.findOne({ 'emailConfirmation.confirmationCode': code });
    }
    //TODO: findUserByConfirmationCode => findUserByCode. как общее решение
    async findUserByCode(type: string, code: string): Promise<WithId<User> | null> {
        return userCollection.findOne({ [type]: code });
    }

    async createUser(credentials: User): Promise<string> {
        const result = await userCollection.insertOne(credentials);

        return result.insertedId.toString();
    }

    // async confirmUser(id: ObjectId): Promise<ResultObject<boolean>> {
    async confirmUser(id: ObjectId): Promise<boolean> {
        const result = await userCollection.updateOne(
            { _id: id },
            { $set: { 'emailConfirmation.isConfirmed': true } }
        );

        // const isUpdated = result.matchedCount === 1;
        // return createResultObject(
        //     isUpdated,
        //     isUpdated ? ResultStatus.NoContent : ResultStatus.BadRequest
        // );

        return result.matchedCount === 1;
    }

    async updateConfirmationCode(userId: ObjectId, code: string): Promise<void> {
        await userCollection.updateOne(
            { _id: userId },
            { $set: { 'emailConfirmation.confirmationCode': code } }
        );
    }

    async deleteUser(id: string): Promise<boolean> {
        const result = await userCollection.deleteOne({ _id: new ObjectId(id) });

        return result.deletedCount === 1;
    }

    async createPasswordCode(userId: string, passwordRecovery: PasswordRecovery): Promise<boolean> {
        const result = await userCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { passwordRecovery } }
        );

        return result.matchedCount === 1;
    }

    async updatePassword(userId: string, newPassword: string): Promise<boolean> {
        const result = await userCollection.updateOne(
            { _id: new ObjectId(userId) },
            {
                $set: {
                    password: newPassword
                }
            }
        );

        return result.matchedCount === 1;
    }

    async deleteRecoveryCode(userId: string): Promise<boolean> {
        const result = await userCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $unset: { passwordRecovery: '' } }
        );

        return result.matchedCount === 1;
    }
}
