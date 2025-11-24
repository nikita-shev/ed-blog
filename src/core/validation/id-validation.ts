import { param } from 'express-validator';

export const idValidation = param('id')
    .exists()
    .withMessage('id is required')
    .isMongoId()
    .withMessage('id is incorrect');

// TODO: replace old "idValidation"
export const validateId = (field: string) => {
    return param(field)
        .exists()
        .withMessage(`${field} is required`)
        .isMongoId()
        .withMessage(`${field} is incorrect`);
};
