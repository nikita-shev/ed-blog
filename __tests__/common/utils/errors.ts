export function incorrectField(field: string) {
    return {
        field,
        message: `${field} is incorrect`
    };
}

export function maxFieldLengthExceeded(field: string, length: number = 15) {
    return {
        field,
        message: `Max length is ${length} characters`
    };
}

export function minFieldLengthExceeded(field: string, length: number = 1) {
    return {
        field,
        message: `Min length is ${length} characters`
    };
}

export function requiredField(field: string) {
    return {
        field,
        message: `${field} is required`
    };
}

export function mustBeString(field: string) {
    return {
        field,
        message: `${field} must be a string`
    };
}
