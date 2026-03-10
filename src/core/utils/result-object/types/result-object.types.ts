import { Error } from '../../../types/error.types';

// rename ResultStatus
export enum ResultStatus {
    Success = 'Success',
    Created = 'Created',
    NotFound = 'NotFound',
    NoContent = 'NoContent',
    Forbidden = 'Forbidden',
    Unauthorized = 'Unauthorized',
    BadRequest = 'BadRequest',
    TooManyRequests = 'TooManyRequests'
}

export interface ExtensionType extends Error {}

// ResultObject
export interface ServiceDto<T = null> {
    status: ResultStatus;
    errorMessage?: string;
    extensions: ExtensionType[];
    data: T;
}

// TODO: не совсем Nullable тип
export type NullableServiceDto<T> = Promise<ServiceDto<null> | ServiceDto<T>>; // NullableResultObject
