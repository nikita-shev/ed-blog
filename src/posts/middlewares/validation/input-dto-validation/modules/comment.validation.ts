import { body } from 'express-validator';

const SETTINGS = {
    minLength: 20,
    maxLength: 300
};

export const commentValidation = body('content')
    .exists()
    .withMessage('Content is required')
    .isString()
    .withMessage('Content must be a string')
    .trim()
    .isLength({ min: SETTINGS.minLength })
    .withMessage(`Min length is ${SETTINGS.minLength} characters`)
    .isLength({ max: SETTINGS.maxLength })
    .withMessage(`Max length is ${SETTINGS.maxLength} characters`);
