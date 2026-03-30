import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { IAccountData, IEmailConfirmation, IUser, IPasswordRecovery } from '../types/users.types';

export type UserDocument = HydratedDocument<IUser>;
type UserModel = Model<IUser>;

const AccountDataSchema = new Schema<IAccountData>({
    login: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: String, required: true }
});

const EmailConfirmationSchema = new Schema<IEmailConfirmation>({
    confirmationCode: { type: String, required: true },
    expirationDate: { type: String, required: true },
    isConfirmed: { type: Boolean, required: true }
});

const PasswordRecoverySchema = new Schema<IPasswordRecovery>({
    code: { type: String, required: true },
    expirationDate: { type: String, required: true }
});

const UserSchema = new Schema<IUser>({
    accountData: [AccountDataSchema],
    emailConfirmation: [EmailConfirmationSchema],
    passwordRecovery: [PasswordRecoverySchema]
});

export const UserModel = model<IUser, UserModel>('users', UserSchema);
