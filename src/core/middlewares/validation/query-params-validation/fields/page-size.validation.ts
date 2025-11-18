import { query } from 'express-validator';

const SETTINGS = {
    default: 10,
    minValue: 1,
    maxValue: 100
};

export const pageSizeValidation = query('pageSize')
    .default(SETTINGS.default)
    .isInt({ min: SETTINGS.minValue, max: SETTINGS.maxValue })
    .withMessage(`Page size must be between ${SETTINGS.minValue} and ${SETTINGS.maxValue}`)
    .toInt();
