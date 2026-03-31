import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { IUserSessionData } from '../types/sessions.types';

export type SessionDocument = HydratedDocument<IUserSessionData>;
type SessionModel = Model<IUserSessionData>;

const SessionSchema = new Schema<IUserSessionData>({
    userId: { type: String, required: true },
    deviceId: { type: String, required: true },
    device: { type: String, required: true },
    iat: { type: String, required: true },
    exp: { type: String, required: true },
    ip: { type: String, required: true }
});

export const SessionModel = model<IUserSessionData, SessionModel>('sessions', SessionSchema);
