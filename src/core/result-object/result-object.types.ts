import { Error } from '../types/error.types';

export enum ResultStatus {
    Success = 'Success',
    NotFound = 'NotFound',
    Forbidden = 'Forbidden',
    Unauthorized = 'Unauthorized',
    BadRequest = 'BadRequest'
}

export interface ExtensionType extends Error {}

export interface ResultObject<T = null> {
    status: ResultStatus;
    errorMessage?: string;
    extensions: ExtensionType[];
    data: T;
}

export type NullableResultObject<T> = Promise<ResultObject<null> | ResultObject<T>>;
