import { param } from 'express-validator';

export const idValidation = param('id')
    .exists()
    .withMessage('id is required')
    .isMongoId()
    .withMessage("id is incorrect'");
