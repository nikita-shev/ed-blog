import { body } from 'express-validator';
import { SETTINGS } from './settings';

const { title, shortDescription, content } = SETTINGS;

const titleValidation = body('title')
    .trim()
    .exists()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .isLength({ min: 1, max: title.maxLength })
    .withMessage(`Max length is ${title.maxLength} characters`);

const shortDescriptionValidation = body('shortDescription')
    .trim()
    .exists()
    .withMessage('shortDescription is required')
    .isString()
    .withMessage('shortDescription must be a string')
    .isLength({ min: 1, max: shortDescription.maxLength })
    .withMessage(`Max length is ${shortDescription.maxLength} characters`);

const contentValidation = body('content')
    .trim()
    .exists()
    .withMessage('content is required')
    .isString()
    .withMessage('content must be a string')
    .isLength({ min: 1, max: content.maxLength })
    .withMessage(`Max length is ${content.maxLength} characters`);

const blogIdValidation = body('blogId')
    .exists()
    .withMessage('blogId is required')
    .isString()
    .withMessage('blogId must be a string');

export const postInputDtoValidation = [
    shortDescriptionValidation,
    titleValidation,
    contentValidation,
    blogIdValidation
];
