import { WithId } from 'mongodb';

export interface UserSessionData {
    userId: string;
    deviceId: string;
    device: string;
    iat: string;
    exp: string;
    ip: string;
}

export type SessionWithId = WithId<Session>;
export interface Session extends UserSessionData {} // only for db
