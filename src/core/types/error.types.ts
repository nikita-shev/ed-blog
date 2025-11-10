export interface Error {
    message: string;
    field: string;
}

export interface ErrorsMessages {
    errorsMessages: Error[];
}
