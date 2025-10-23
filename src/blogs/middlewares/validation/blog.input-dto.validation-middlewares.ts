import { body } from 'express-validator';
import { SETTINGS } from './settings';

const { name, description, url } = SETTINGS;

const nameValidation = body('name')
    .trim()
    .exists()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 1, max: name.maxLength })
    .withMessage(`Max length is ${name.maxLength} characters`);

const descriptionValidation = body('description')
    .trim()
    .exists()
    .withMessage('Description is required')
    .isString()
    .withMessage('Description must be a string')
    .isLength({ min: 1, max: description.maxLength })
    .withMessage(`Max length is ${description.maxLength} characters`);

const urlValidation = body('websiteUrl')
    .trim()
    .exists()
    .withMessage('websiteUrl is required')
    .isString()
    .withMessage('websiteUrl must be a string')
    .isLength({ min: 1, max: url.maxLength })
    .withMessage(`Max length is ${url.maxLength} characters`)
    .matches(url.pattern)
    .withMessage('websiteUrl is incorrect');

export const blogInputDtoValidation = [urlValidation, nameValidation, descriptionValidation];
