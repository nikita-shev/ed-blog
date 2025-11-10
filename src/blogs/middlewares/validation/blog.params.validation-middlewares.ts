import { param } from 'express-validator';

export const blogIdValidation = param('blogId')
    .exists()
    .withMessage('blogId is required')
    .isMongoId()
    .withMessage('blogId is incorrect');
