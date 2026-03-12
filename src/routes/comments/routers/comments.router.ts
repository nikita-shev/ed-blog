import { Router } from 'express';
import { validateId } from '../../../core/validation/id-validation';
import { inputValidationResultMiddleware } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { getCommentHandler } from './handlers/get-comment.handler';
import { deleteCommentHandler } from './handlers/delete-comment.handler';
import { authBearerMiddleware } from '../../../core/middlewares/auth.middleware';
import { updateCommentHandler } from './handlers/update-comment.handler';
import { commentInputDtoValidation } from '../../posts/middlewares/validation/input-dto-validation';

export const commentsRouter = Router();

commentsRouter
    .get('/:id', validateId('id'), inputValidationResultMiddleware, getCommentHandler)
    .put(
        '/:id',
        authBearerMiddleware,
        validateId('id'),
        commentInputDtoValidation,
        inputValidationResultMiddleware,
        updateCommentHandler
    )
    .delete(
        '/:id',
        authBearerMiddleware,
        validateId('id'),
        inputValidationResultMiddleware,
        deleteCommentHandler
    );
