import { body } from 'express-validator';

export const recoveryCodeValidation = body('recoveryCode')
    .exists()
    .withMessage('recoveryCode is required')
    .isString()
    .withMessage('recoveryCode must be a string');
