import { body } from 'express-validator';
import { SETTINGS } from './settings';

const { name, description, url } = SETTINGS;

const nameValidation = body('name')
    .exists()
    .withMessage('name is required')
    .isString()
    .withMessage('name must be a string')
    .trim()
    .isLength({ min: name.minLength })
    .withMessage(`Min length is ${name.minLength} characters`)
    .isLength({ max: name.maxLength })
    .withMessage(`Max length is ${name.maxLength} characters`);

const descriptionValidation = body('description')
    .exists()
    .withMessage('description is required')
    .isString()
    .withMessage('description must be a string')
    .trim()
    .isLength({ min: description.minLength })
    .withMessage(`Min length is ${description.minLength} characters`)
    .isLength({ max: description.maxLength })
    .withMessage(`Max length is ${description.maxLength} characters`);

const urlValidation = body('websiteUrl')
    .exists()
    .withMessage('websiteUrl is required')
    .isString()
    .withMessage('websiteUrl must be a string')
    .trim()
    .isLength({ min: url.minLength })
    .withMessage(`Min length is ${url.minLength} characters`)
    .isLength({ max: url.maxLength })
    .withMessage(`Max length is ${url.maxLength} characters`)
    .matches(url.pattern)
    .withMessage('websiteUrl is incorrect');

export const blogInputDtoValidation = [urlValidation, nameValidation, descriptionValidation];
