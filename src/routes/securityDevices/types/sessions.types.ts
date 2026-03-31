import { WithId } from 'mongodb';

export interface IUserSessionData {
    userId: string;
    deviceId: string;
    device: string;
    iat: string;
    exp: string;
    ip: string;
}

export interface ISessionForService extends IUserSessionData {
    // id: string;
}

export type TSessionWithId = WithId<IUserSessionData>;
