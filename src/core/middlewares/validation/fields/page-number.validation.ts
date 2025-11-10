import { query } from 'express-validator';

const SETTINGS = {
    default: 1,
    minValue: 1
};

export const pageNumberValidation = query('pageNumber')
    .default(SETTINGS.default)
    .isInt({ min: SETTINGS.minValue })
    .withMessage('Page number must be a positive integer')
    .toInt();
