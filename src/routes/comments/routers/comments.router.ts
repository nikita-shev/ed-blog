import { Router } from 'express';
import { validateId } from '../../../core/validation/id-validation';
import { inputValidationResultMiddleware } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { authBearerMiddleware } from '../../../core/middlewares/auth.middleware';
import { commentInputDtoValidation } from '../../posts/middlewares/validation/input-dto-validation';
import { commentsController } from '../../../composition-root';

export const commentsRouter = Router();

commentsRouter
    .get(
        '/:id',
        validateId('id'),
        inputValidationResultMiddleware,
        commentsController.getComment.bind(commentsController)
    )
    .put(
        '/:id',
        authBearerMiddleware,
        validateId('id'),
        commentInputDtoValidation,
        inputValidationResultMiddleware,
        commentsController.updateComment.bind(commentsController)
    )
    .delete(
        '/:id',
        authBearerMiddleware,
        validateId('id'),
        inputValidationResultMiddleware,
        commentsController.deleteComment.bind(commentsController)
    );
