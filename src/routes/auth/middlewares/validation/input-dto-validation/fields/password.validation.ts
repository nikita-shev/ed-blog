import { body } from 'express-validator';

const SETTINGS = {
    minValue: 6,
    maxValue: 20
};

export const passwordValidation = body('password')
    .exists()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string');

export const newPasswordValidation = body('newPassword')
    .exists()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string')
    .trim()
    .isLength({ min: SETTINGS.minValue, max: SETTINGS.maxValue })
    .withMessage(`newPassword must be between ${SETTINGS.minValue} and ${SETTINGS.maxValue}`);
