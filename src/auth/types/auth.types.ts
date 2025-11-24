import { BasicUser } from '../../users/types/users.types';

export interface CurrentUser extends BasicUser {
    userId: string;
}
