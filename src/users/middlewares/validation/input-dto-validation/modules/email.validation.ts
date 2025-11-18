import { body } from 'express-validator';

const SETTINGS = {
    pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
};

export const emailValidation = body('email')
    .exists()
    .withMessage('Email is required')
    .isString()
    .withMessage('Email must be a string')
    .trim()
    .matches(SETTINGS.pattern)
    .withMessage('Email is incorrect');
