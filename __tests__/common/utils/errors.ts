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

export function requiredField(field: string) {
    return {
        field: `${field[0].toLowerCase()}${field.slice(1)}`,
        message: `${field[0].toUpperCase()}${field.slice(1)} is required`
    };
}
