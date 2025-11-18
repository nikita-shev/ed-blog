import { body } from 'express-validator';

const SETTINGS = {
    minLength: 3,
    maxLength: 10,
    pattern: '^[a-zA-Z0-9_-]*$'
};

export const loginValidation = body('login')
    .exists()
    .withMessage('Login is required')
    .isString()
    .withMessage('Login must be a string')
    .trim()
    .isLength({ min: SETTINGS.minLength })
    .withMessage(`Min length is ${SETTINGS.minLength} characters`)
    .isLength({ max: SETTINGS.maxLength })
    .withMessage(`Max length is ${SETTINGS.maxLength} characters`)
    .matches(SETTINGS.pattern)
    .withMessage('Login is incorrect');
