export interface UserSessionData {
    userId: string;
    deviceId: string;
    device: string;
    iat: string;
    exp: string;

    ip?: string;
}

export interface Session extends UserSessionData {} // only for db
