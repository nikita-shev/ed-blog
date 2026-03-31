import { injectable } from 'inversify';
import { UserDocument, UserModel } from '../schema/schema';

@injectable()
export class UsersRepository {
    async save(document: UserDocument): Promise<void> {
        await document.save();
    }

    //TODO: или разделить на два отдельных метода: findUserByLogin и findUserByEmail ? (support)
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDocument | null> {
        return UserModel.findOne({
            $or: [{ 'accountData.login': loginOrEmail }, { 'accountData.email': loginOrEmail }]
        });
    }

    async findUserById(userId: string): Promise<UserDocument | null> {
        return UserModel.findOne({ _id: userId });
    }

    async findUserByCode(type: string, code: string): Promise<UserDocument | null> {
        return UserModel.findOne({ [type]: code });
    }

    async deleteUser(id: string): Promise<boolean> {
        const result = await UserModel.deleteOne({ _id: id });

        return result.deletedCount === 1;
    }

    async deleteRecoveryCode(userId: string): Promise<boolean> {
        const result = await UserModel.updateOne(
            { _id: userId },
            { $unset: { passwordRecovery: '' } }
        );

        return result.matchedCount === 1;
    }
}
