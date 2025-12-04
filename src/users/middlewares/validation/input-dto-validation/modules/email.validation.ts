import { body } from 'express-validator';

const SETTINGS = {
    pattern: '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'
};

export const emailValidation = body('email')
    .exists()
    .withMessage('Email is required')
    .isString()
    .withMessage('Email must be a string')
    .trim()
    .matches(SETTINGS.pattern)
    .withMessage('Email is incorrect');
