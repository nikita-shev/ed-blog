import { body } from 'express-validator';

export const loginOrEmailValidation = body('loginOrEmail')
    .exists()
    .withMessage('Login is required')
    .isString()
    .withMessage('Login must be a string');
