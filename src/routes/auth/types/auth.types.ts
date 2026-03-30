import { IBasicUser } from '../../users/types/users.types';

export interface CurrentUser extends IBasicUser {
    userId: string;
}

export interface ServiceInfo {
    device?: string;
    ip?: string
}
