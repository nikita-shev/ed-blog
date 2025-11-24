import { BasicUser } from '../../users/types/users.types';
import { ResultObject } from '../../core/result-object/result-object.types';

export interface CurrentUser extends BasicUser {
    userId: string;
}

export type NullableResultObject<T> = Promise<ResultObject<null> | ResultObject<T>>;
