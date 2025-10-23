export interface Error {
    message: string;
    field: string;
}

export interface ErrorMessages {
    errorMessages: Error[];
}
