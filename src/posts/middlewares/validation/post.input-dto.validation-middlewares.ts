import { body } from 'express-validator';
import { SETTINGS } from './settings';

const { title, shortDescription, content } = SETTINGS;

const titleValidation = body('title')
    .exists()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .trim()
    .isLength({ min: title.minLength })
    .withMessage(`Min length is ${title.minLength} characters`)
    .isLength({ max: title.maxLength })
    .withMessage(`Max length is ${title.maxLength} characters`);

const shortDescriptionValidation = body('shortDescription')
    .exists()
    .withMessage('shortDescription is required')
    .isString()
    .withMessage('shortDescription must be a string')
    .trim()
    .isLength({ min: shortDescription.minLength })
    .withMessage(`Min length is ${shortDescription.minLength} characters`)
    .isLength({ max: shortDescription.maxLength })
    .withMessage(`Max length is ${shortDescription.maxLength} characters`);

const contentValidation = body('content')
    .exists()
    .withMessage('content is required')
    .isString()
    .withMessage('content must be a string')
    .trim()
    .isLength({ min: content.minLength })
    .withMessage(`Min length is ${content.minLength} characters`)
    .isLength({ max: content.maxLength })
    .withMessage(`Max length is ${content.maxLength} characters`);

const blogIdValidation = body('blogId')
    .exists()
    .withMessage('blogId is required')
    .isString()
    .withMessage('blogId must be a string');

export const postInputDtoValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation
];

export const postInputWithoutBlogIdDtoValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation
];
