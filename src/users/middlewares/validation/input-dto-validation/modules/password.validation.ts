import { body } from 'express-validator';

const SETTINGS = {
    minLength: 6,
    maxLength: 20
};

export const passwordValidation = body('password')
    .exists()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string')
    .trim()
    .isLength({ min: SETTINGS.minLength })
    .withMessage(`Min length is ${SETTINGS.minLength} characters`)
    .isLength({ max: SETTINGS.maxLength })
    .withMessage(`Max length is ${SETTINGS.maxLength} characters`);
