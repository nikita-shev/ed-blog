import { query } from 'express-validator';

export function sortByValidation(allowedFields: string[]) {
    return query('sortBy')
        .default(allowedFields[0])
        .isIn(allowedFields)
        .withMessage(`Invalid sort field. Allowed values: ${allowedFields.join(', ')}`);
}
