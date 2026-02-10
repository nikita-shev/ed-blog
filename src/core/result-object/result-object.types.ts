import { Error } from '../types/error.types';

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

export interface ResultObject<T = null> {
    status: ResultStatus;
    errorMessage?: string;
    extensions: ExtensionType[];
    data: T;
}

export type NullableResultObject<T> = Promise<ResultObject<null> | ResultObject<T>>;
